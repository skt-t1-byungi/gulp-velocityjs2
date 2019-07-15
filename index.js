const through = require('through2')
const PluginError = require('plugin-error')
const { resolve, basename, extname } = require('path')
const { silent: resolveFrom } = require('resolve-from')
const { Compile, parse } = require('velocityjs')
const importFresh = require('import-fresh')
const replaceExt = require('replace-ext')

module.exports = function (data, opts = {}) {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) return cb(null, file)

        if (file.isStream()) {
            return cb(new PluginError('gulp-velocity.js', 'Streaming not supported!'))
        }

        if (typeof data === 'string') {
            const cwd = process.cwd()
            const load = opts.refresh ? importFresh : require
            try {
                data = load(
                    resolveFrom(cwd, data) ||
                    resolveFrom(cwd, resolve(data, basename(file.path, extname(file.path))))
                )
            } catch (err) {
                data = {}
            }
        } else {
            data = Object.assign(Object(data), file.data)
        }

        if (file.path) {
            file.path = replaceExt(file.path, opts.ext === '' ? '' : '.' + (opts.ext || 'html'))
        }

        try {
            const ast = parse(file.contents.toString(), opts.blocks, opts.ignorespace)
            const rendered = (new Compile(ast, opts)).render(data, opts.macros)
            file.contents = Buffer.from(rendered)
        } catch (err) {
            return cb(new PluginError('gulp-velocity.js', err, { fileName: file.path }))
        }

        cb(null, file)
    })
}
