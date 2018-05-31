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
### gulpVTL(data?: object|string, options?: object)
Returns gulp tranform for velocity compilation.

#### data
Set the variable value.

##### Data path
If it is a data path, inject the file data.
###### Exmaple
```js
return gulp.src('template/*.vm')
  .pipe( gulpVTL('data/') )
```
`template/main.vm`
```
hello $value
```
`data/main.js`
```js
export.value = 'world'
```
results `hello world`.

#### options
Compile options. details https://github.com/shepherdwind/velocity.js
- escape 
- unescape
- env
- blocks
- ignorespace
- macros

#### Related
- [shepherdwind/velocity.js](https://github.com/shepherdwind/velocity.js)
- http://velocity.apache.org

## License
MIT