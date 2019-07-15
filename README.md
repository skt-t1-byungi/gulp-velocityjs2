# gulp-velocityjs2
Gulp compile plugin for velocity(http://velocity.apache.org/) template.

[![npm](https://img.shields.io/npm/v/gulp-velocityjs2.svg?style=flat-square)](https://www.npmjs.com/package/gulp-velocityjs2)
[![npm](https://img.shields.io/npm/dt/gulp-velocityjs2.svg?style=flat-square)](https://www.npmjs.com/package/gulp-velocityjs2)

## Install
```sh
yarn add gulp-velocityjs2
```

## Usage
### Basic
```js
const gulp = require('gulp');
const gulpVTL = require('gulp-velocityjs2');

gulp.task('build', ()=>{
  return gulp.src('./index.vm')
    .pipe( gulpVTL() )
    .pipe(gulp.dest('./build'));
});
```

### Variable
```html
<div>hello $name</div>
```
```js
gulp.task('build', ()=>{
  return gulp.src('./hello.vm')
    .pipe( gulpVTL({ name: 'byungi' }) )
    .pipe(gulp.dest('./build'));
});
```
output:
```html
<div>hello byungi</div>
```

## API
### gulpVTL([data[, options]])
Returns gulp transformer for velocity compilation.

#### data
Set the data values.

##### object
```js
gulp.src('index.vm')
    .pipe(gulpVTL({var1: 'value1', var2: 'value2'}))
```

##### file
```js
gulp.src('index.vm')
    .pipe(gulpVTL('./data.json'))
```

##### directory
If it is a `directory`, set the data that matches the file name in the directory.

```js
gulp.src('view/*.vm')
  .pipe( gulpVTL('data/') )
```
`view/main.vm`
```
hello $value
```
`data/main.js`
```js
export.value = 'world'
```
output:
```html
hello world
```

#### options
##### Compile options
details https://github.com/shepherdwind/velocity.js

- `escape`
- `unescape`
- `env`
- `blocks`
- `ignorespace`
- `macros`

##### Other options
###### ext
Output extension name. Default is html

###### refresh
If this value is true, import new data from the path without cache. This is useful when in watch mode. Default is false.


## Related
- [shepherdwind/velocity.js](https://github.com/shepherdwind/velocity.js)
- http://velocity.apache.org

## License
MIT
