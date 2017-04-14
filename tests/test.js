var fs = require('fs')
var path = require('path')
var test = require('tape')
var hyperdrive = require('hyperdrive')
var ram = require('random-access-memory')
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

test('count single file', function (t) {
  count(path.join(__dirname, 'fixtures', '1.txt'), function (err, stats) {
    t.ifError(err, 'count error')
    t.ok(stats, 'stats ok')
    t.same(stats.files, 1, '1 files')
    t.same(stats.dirs, 0, '0 dirs')
    t.same(stats.bytes, 3, 'size')
    t.end()
  })
})

test('dereference option', function (t) {
  var src = path.join(__dirname, 'fixtures', '1.txt')
  var target = path.join(__dirname, 'fixtures', '2.txt')
  fs.symlinkSync(src, target)
  var linkStat = fs.lstatSync(target)

  count(path.join(__dirname, 'fixtures'), function (err, stats) {
    t.ifError(err, 'count error')
    t.ok(stats, 'stats ok')
    t.same(stats.files, 3, 'three files')
    t.same(stats.dirs, 1, 'one dirs')
    t.same(stats.bytes, 26 + linkStat.size, 'size')

    count(path.join(__dirname, 'fixtures'), {dereference: true}, function (err, stats) {
      t.ifError(err, 'count error')
      t.ok(stats, 'stats ok')
      t.same(stats.files, 3, 'three files')
      t.same(stats.dirs, 1, 'one dirs')
      t.same(stats.bytes, 29, 'size')

      fs.unlinkSync(target)
      t.end()
    })
  })
})

test('count with regular fs as arg', function (t) {
  count({fs: fs, name: path.join(__dirname, 'fixtures')}, function (err, stats) {
    t.ifError(err, 'count error')
    t.ok(stats, 'stats ok')
    t.same(stats.files, 2, 'two files')
    t.same(stats.dirs, 1, 'one dirs')
    t.same(stats.bytes, 26, 'size')
    t.end()
  })
})

test('count with custom fs', function (t) {
  makeArchive(function (err, archive) {
    t.ifError(err)
    count({fs: archive, name: '/'}, function (err, stats) {
      t.ifError(err, 'count error')
      t.ok(stats, 'stats ok')
      t.same(stats.files, 2, 'two files')
      t.same(stats.dirs, 1, 'one dirs')
      t.same(stats.bytes, 26, 'size')
      t.end()
    })
  })
})

test('count with custom fs + ignore', function (t) {
  makeArchive(function (err, archive) {
    t.ifError(err)
    count({fs: archive, name: '/'}, {
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
})

test('count custom fs + single file', function (t) {
  makeArchive(function (err, archive) {
    t.ifError(err)
    count({fs: archive, name: '/1.txt'}, function (err, stats) {
      t.ifError(err, 'count error')
      t.ok(stats, 'stats ok')
      t.same(stats.files, 1, '1 files')
      t.same(stats.dirs, 0, '0 dirs')
      t.same(stats.bytes, 3, 'size')
      t.end()
    })
  })
})
test('count custom fs one file', function (t) {
  makeOneFileArchive(function (err, archive) {
    t.ifError(err)
    count({fs: archive, name: '/1.txt'}, function (err, stats) {
      t.ifError(err, 'count error')
      t.ok(stats, 'stats ok')
      t.same(stats.files, 1, '1 files')
      t.same(stats.dirs, 0, '0 dirs')
      t.same(stats.bytes, 3, 'size')
      t.end()
    })
  })
})

function makeArchive (cb) {
  var archive = hyperdrive(ram)
  var fixtures = path.join(__dirname, 'fixtures')
  archive.writeFile('1.txt', fs.readFileSync(path.join(fixtures, '1.txt')), function (err) {
    if (err) return cb(err)
    archive.writeFile('dir/2.txt', fs.readFileSync(path.join(fixtures, 'dir', '2.txt')), done)
  })

  function done (err) {
    if (err) return cb(err)
    archive.ready(function (err) {
      if (err) return cb(err)
      cb(null, archive)
    })
  }
}

function makeOneFileArchive (cb) {
  var archive = hyperdrive(ram)
  var fixtures = path.join(__dirname, 'fixtures')
  archive.writeFile('1.txt', fs.readFileSync(path.join(fixtures, '1.txt')), done)

  function done (err) {
    if (err) return cb(err)
    archive.ready(function (err) {
      if (err) return cb(err)
      cb(null, archive)
    })
  }
}
