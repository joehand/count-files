var path = require('path')
var test = require('tape')
var count = require('..')

test('count files', function (t) {
  count(path.join(__dirname, 'fixtures'), function (err, stats) {
    t.ifError(err, 'count error')
    t.ok(stats, 'stats ok')
    t.same(stats.files, 2, 'two files')
    t.same(stats.dirs, 1, 'one dirs')
    t.same(stats.bytes, 26, 'size')
    t.end()
  })
})

test('count files with ignore', function (t) {
  count(path.join(__dirname, 'fixtures'), {
    ignore: function (name) {
      return name.indexOf('dir') > -1
    }
  }, function (err, stats) {
    t.ifError(err, 'count error')
    t.ok(stats, 'stats ok')
    t.same(stats.files, 1, '1 files')
    t.same(stats.dirs, 0, '0 dirs')
    t.same(stats.bytes, 3, 'size')
    t.end()
  })
})

test('pass a file as dir', function (t) {
  count(path.join(__dirname, 'fixtures', '1.txt'), function (err, stats) {
    t.ifError(err, 'count error')
    t.ok(stats, 'stats ok')
    t.same(stats.files, 1, '1 files')
    t.same(stats.dirs, 0, '0 dirs')
    t.same(stats.bytes, 3, 'size')
    t.end()
  })
})
