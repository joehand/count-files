# Count Files

[![Travis](https://img.shields.io/travis/joehand/count-files/master.svg?style=flat-square)](https://travis-ci.org/joehand/count-files) [![npm](https://img.shields.io/npm/v/count-files.svg?style=flat-square)](https://npmjs.org/package/count-files)

Count files, directories, and bytes in a directory recursively. 

Ignore files in the count.

## Usage

`count-files` has a very simple command line tool, use `npm install -g count-files` to install.

```
❯ count-files ./
Counting files and directories in...
/joe/node_modules/count-files

Results:
 Files:  13
 Dirs:   4
 Size:   10 KB
```

In javascript, use it like so:

```javascript
var countFiles = require('count-files')

var stats = countFiles(dir, function (err, results) {
  console.log('done counting')
  console.log(results) // { files: 10, dirs: 2, bytes: 234 }
})

setInterval(function () {
  console.log('current count', stats) // { files: 4, dirs: 1, bytes: 34 }
}, 500)
```

## API

### var stats = countFiles(dir, [opts], cb) { }

Callback returns a stats object: `{files, dirs, bytes}`.

Options include:

```js
opts = {
  ignore: function (file) {
    return match(['**/*.js'], file) // return true to ignore file
  }
}
```

We find [anymatch](https://github.com/es128/anymatch) nice for ignoring files!

That's all folks!

## Development

Some basic performance testing in `tests/perf.js` and alternate implementations in `lib/`. I think I chose the fastest but didn't test all situations!

## License

ISC
