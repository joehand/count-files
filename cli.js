#!/usr/bin/env node

var path = require('path')
var prettyBytes = require('prettier-bytes')
var neatLog = require('neat-log')
var output = require('neat-log/output')
var count = require('.')

var dir = process.argv[2] || process.cwd()
var neat = neatLog(view)
neat.use(doCount)

function view (state) {
  if (!state.stats) return 'Hello! Let me see what you have here.'
  return output`
    Counting files and directories in...
    ${path.resolve(dir)}

    Files: ${state.stats.files}
    Dirs: ${state.stats.dirs}
    Size: ${prettyBytes(state.stats.bytes)}
  `
}

function doCount (state, bus) {
  state.stats = count(dir, function (err, stats) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    state.stats = stats
    neat.render()
    console.log('\nAll done!')
    process.exit(0)
  })
  setInterval(function () {
    // Print updated stats
    // TODO: could check for changes?
    bus.emit('render')
  }, 100)
  bus.emit('render')
}
