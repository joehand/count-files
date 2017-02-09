#!/usr/bin/env node

var count = require('.')

var dir = process.argv[2] || process.cwd()

console.log('Counting files and directories...')
count(dir, function (err, stats) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('\nResults:')
  console.log(' Files: ', stats.files)
  console.log(' Dirs:  ', stats.dirs)
  console.log(' Size:  ', stats.bytes)
})
