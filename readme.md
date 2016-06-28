# Count Files

Count files, directories, and bytes in a directory recursively. 

```javascript
var countFiles = require('count-files')

countFiles(dir, function (err, stats) {
    // use stats
})

stats = {
  files: 100,
  dirs: 20,
  bytes: 234213
}
```

Filter files with `opts.filter`. Filter function returns true to count.
