var path = require('path')
var os = require('os')
var bench = require('nanobench')
var match = require('anymatch')

bench('IMPL1: file counting', function (b) {
  var counter = require('..')
  var dir = path.join(__dirname, '..')

  b.start()

  counter(dir, function (err, stats) {
    if (err) throw err
    console.log('counted', stats)
    b.end()
  })
})

bench('file counting, ignore **/*.js', function (b) {
  var counter = require('..')
  var dir = path.join(__dirname, '..')
  var ignore = function (file) {
    return match(['**/*.js'], file)
  }

  b.start()

  counter(dir, {ignore: ignore}, function (err, stats) {
    if (err) throw err
    console.log('counted', stats)
    b.end()
  })
})

// bench('IMPL1: file counting of node_modules', function (b) {
//   var counter = require('../lib/counter1')
//   var dir = path.join(__dirname, '..')

//   b.start()

//   counter(dir, function (err, stats) {
//     if (err) throw err
//     console.log('counted', stats)
//     b.end()
//   })
// })

// bench('file counting of homedir, WARNING: slow!', function (b) {
//   var counter = require('..')
//   var dir = os.homedir()

//   b.start()

//   counter(dir, function (err, stats) {
//     if (err) throw err
//     console.log('counted', stats)
//     b.end()
//   })
// })