var fs = require('fs')
var path = require('path')

module.exports = countFiles

function countFiles (dir, opts, cb) {
  if (typeof (opts) === 'function') return countFiles(dir, null, opts)

  if (!opts) opts = {}
  var filter = opts.filter || function (filename) { return true }
  var count = {
    files: 0,
    dirs: 0,
    bytes: 0
  }

  fs.readdir(dir, function (err, files) {
    if (err) return cb(err)
    var pending = files.length
    if (!pending) return cb(null, count)

    files.forEach(function (file) {
      var filePath = path.join(dir, file)

      if (!filter(filePath)) {
        pending -= 1
        if (!pending) return cb(null, count)
        return
      }

      fs.stat(filePath, function (err, stats) {
        if (err && err.code === 'ENOENT') {
          // symlinks
          pending -= 1
          if (!pending) return cb(null, count)
          return
        } else if (err) {
          cb(err)
        }
        if (stats.isDirectory()) {
          count.dirs += 1
          countFiles(filePath, opts, function (err, res) {
            if (err) return cb(err)
            count.dirs += res.dirs
            count.files += res.files
            count.bytes += res.bytes
            pending -= 1
            if (!pending) return cb(null, count)
          })
        } else {
          count.files += 1
          count.bytes += stats.size
          pending -= 1
          if (!pending) return cb(null, count)
        }
      })
    })
  })
}
