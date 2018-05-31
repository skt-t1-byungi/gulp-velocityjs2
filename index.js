const through = require('through2')
const PluginError = require('plugin-error')
const {resolve, basename, extname} = require('path')
const {silent: resolveFrom} = require('resolve-from')
const {Compile, parse} = require('velocityjs')
const importFresh = require('import-fresh')

module.exports = function (ctx, opts = {}) {
  return through.obj((file, enc, cb) => {
    if (file.isNull()) return cb(null, file)
    if (file.isStream()) return cb(new PluginError('gulp-velocity.js', 'Streaming not supported!'))

    try {
      const asts = parse(file.contents.toString(), opts.blocks, opts.ignorespace)
      const rendered = (new Compile(asts, opts)).render(resolveUserData(ctx, file), opts.macros)

      file.contents = Buffer.from(rendered)
    } catch (err) {
      return cb(new PluginError('gulp-velocity.js', err, {fileName: file.path}))
    }

    cb(null, file)
  })
}

function resolveUserData (ctx, file) {
  if (typeof ctx !== 'string') return Object.assign({}, ctx, file.data)

  try {
    return importFresh(
      resolveFrom(process.cwd(), ctx) ||
      resolveFrom(process.cwd(), resolve(ctx, basename(file.path, extname(file.path))))
    )
  } catch (err) {
    return {}
  }
}
