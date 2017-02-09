var fs = require('fs')
var path = require('path')

module.exports = function (dir, cb) {
  walk(dir, function (err, results) {
    if (err) return cb(err)
    var stats = {
      files: 0,
      size: 0
    }
    next()

    function next () {
      if (!results.length) return cb(null, stats)
      var file = results.pop()
      stats.files++
      fs.stat(file, function (err, stat) {
        if (err) return cb(err)
        stats.size += stat.size
        next()
      })
    }
  })
}

function walk (dir, cb) {
  var results = []
  fs.readdir(dir, function (err, list) {
    if (err) return cb(err)
    var pending = list.length
    if (!pending) return cb(null, results)
    list.forEach(function (file) {
      file = path.resolve(dir, file)
      fs.stat(file, function (err, stat) {
        if (err) return cb(err)
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            if (err) return cb(err)
            results = results.concat(res)
            if (!--pending) cb(null, results)
          })
        } else {
          results.push(file)
          if (!--pending) cb(null, results)
        }
      })
    })
  })
}
