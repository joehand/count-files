var fs = require('fs')
var path = require('path')

module.exports = count

function count (src, opts, cb) {
  if (typeof opts === 'function') return count(src, {}, opts)

  src = parse(src)
  opts = Object.assign({}, opts)
  var totalStats = opts._stats || {
    files: 0,
    dirs: 0,
    bytes: 0
  }
  if (!opts._stats) opts._stats = totalStats
  if (!opts.ignore) opts.ignore = function () { return false }

  src.fs.readdir(src.name, function (err, list) {
    if (err && err.code === 'ENOTDIR' || (!list || !list.length)) return countFile() // Single file
    if (err) return cb(err)

    var pending = list.length
    if (!pending) return cb(null, totalStats)
    list.forEach(function (file) {
      file = path.resolve(src.name, file)
      if (opts.ignore(file)) {
        if (!--pending) cb(null, totalStats)
        return
      }
      stat(src.fs, file, function (err, st) {
        if (err) return cb(err)
        if (st && st.isDirectory()) {
          totalStats.dirs++
          // Uses opts._stats to add to total
          count({name: file, fs: src.fs}, opts, function (err, cnt) {
            if (err) return cb(err)
            if (!--pending) cb(null, totalStats)
          })
        } else {
          totalStats.files++
          if (st) totalStats.bytes += st.size
          if (!--pending) cb(null, totalStats)
        }
      })
    })
  })

  return totalStats

  function stat (fs, name, cb) {
    if (opts.dereference) fs.stat(name, cb)
    else fs.lstat(name, cb)
  }

  function countFile () {
    // src === a single file, just count that
    stat(src.fs, src.name, function (err, st) {
      if (err) return cb(err)
      totalStats.files++
      totalStats.bytes += st.size
      cb(null, totalStats)
    })
  }

  function parse (name) {
    if (typeof name === 'string') return {name: path.resolve(name), fs: fs}
    name.name = path.resolve(name.name)
    if (!name.fs) name.fs = fs
    return name
  }
}
