var each = require('stream-each')
var walker = require('folder-walker')

module.exports = counter

function counter (dir, ignore, cb) {
  if (typeof cb === 'undefined') return counter(dir, null, ignore)
  if (!ignore) ignore = function () { return true }
  var countStats = {
    files: 0,
    bytes: 0
  }

  // Start counting the files
  each(walker(dir), countFiles, function (err) {
    if (err) return cb(err)
    cb(null, countStats)
  })

  function countFiles (data, next) {
    if (ignore) return next()
    if (data.type === 'file') {
      countStats.files += 1
      countStats.bytes += data.stat.size
    }
    next()
  }
}
