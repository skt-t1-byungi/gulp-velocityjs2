const through = require('through2')
const PluginError = require('plugin-error')
const { resolve, basename, extname } = require('path')
const { silent: resolveFrom } = require('resolve-from')
const { Compile, parse } = require('velocityjs')
const importFresh = require('import-fresh')

const cwd = process.cwd()

module.exports = function (path, opts = {}) {
    return through.obj((file, enc, cb) => {
        if (file.isNull()) return cb(null, file)

        if (file.isStream()) {
            return cb(new PluginError('gulp-velocity.js', 'Streaming not supported!'))
        }

        try {
            const ast = parse(file.contents.toString(), opts.blocks, opts.ignorespace)
            const rendered = (new Compile(ast, opts)).render(resolveUserData(path, file), opts.macros)
            file.contents = Buffer.from(rendered)
        } catch (err) {
            return cb(new PluginError('gulp-velocity.js', err, { fileName: file.path }))
        }

        cb(null, file)
    })
}

function resolveUserData (path, file) {
    if (typeof path !== 'string') return Object.assign({}, path, file.data)

    let userData
    try {
        userData = importFresh(
            resolveFrom(cwd, path) ||
            resolveFrom(cwd, resolve(path, basename(file.path, extname(file.path))))
        )
    } catch (err) {
        userData = {}
    }

    return Object.assign(userData, file.data)
}
