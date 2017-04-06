var fs = require('fs')
var path = require('path')

module.exports = count

function count (dir, opts, cb) {
  if (typeof opts === 'function') return count(dir, {}, opts)
  opts = opts || {}
  if (!opts.ignore) opts.ignore = function () { return false }
  var totalStats = opts._stats || {
    files: 0,
    dirs: 0,
    bytes: 0
  }
  if (!opts._stats) opts._stats = totalStats

  fs.readdir(dir, function (err, list) {
    if (err && err.code === 'ENOTDIR') return countFile() // Single file
    if (err) return cb(err)

    var pending = list.length
    if (!pending) return cb(null, totalStats)
    list.forEach(function (file) {
      file = path.resolve(dir, file)
      if (opts.ignore(file)) {
        if (!--pending) cb(null, totalStats)
        return
      }
      stat(file, function (err, st) {
        if (err) return cb(err)
        if (st && st.isDirectory()) {
          totalStats.dirs++
          // Uses opts._stats to add to total
          count(file, opts, function (err, cnt) {
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

  function stat (name, cb) {
    if (opts.dereference) fs.stat(name, cb)
    else fs.lstat(name, cb)
  }

  function countFile () {
    // dir === a single file, just count that
    stat(dir, function (err, st) {
      if (err) return cb(err)
      totalStats.files++
      totalStats.bytes += st.size
      cb(null, totalStats)
    })
  }
}
