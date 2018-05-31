import test from 'ava'
import File from 'vinyl'
import gulpVTL from '.'

const fixture = (tpl, stream, opts = {}) => new Promise((resolve, reject) => {
  stream.on('data', resolve)
  stream.on('error', reject)

  stream.end(new File({
    cwd: __dirname,
    base: __dirname,
    contents: Buffer.from(tpl),
    ...opts
  }))
})

test(async t => {
  const file = await fixture(
    'hello $value',
    gulpVTL({value: 'world'})
  )
  t.is(file.contents.toString(), 'hello world')
})
