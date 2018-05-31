const through = require('through2')
const PluginError = require('plugin-error')
const {resolve, basename, extname} = require('path')
const {silent: resolveFrom} = require('resolve-from')
const {Compile, Parser} = require('velocityjs')

module.exports = function (ctx, opts = {}) {
  return through.obj((file, enc, cb) => {
    if (file.isNull()) return cb(null, file)
    if (file.isStream()) return cb(new PluginError('gulp-velocity.js', 'Streaming not supported!'))

    if (typeof data === 'string') {
      try {
        ctx = require(
          resolveFrom(process.cwd(), ctx) ||
          resolveFrom(process.cwd(), resolve(ctx, basename(file.path, extname(file.path))))
        )
      } catch (err) {
        return cb(new PluginError('gulp-velocity.js', `Can not find data file(${ctx}).`))
      }
    } else {
      ctx = Object.assign({}, ctx, file.data)
    }

    try {
      const asts = Parser.parse(file.contents.toString(), opts.blocks, opts.ignorespace)
      file.contents = Buffer.from((new Compile(asts)).render(ctx, opts.macros))
    } catch (err) {
      return cb(new PluginError('gulp-velocity.js', err, {fileName: file.path}))
    }

    cb(null, file)
  })
}
