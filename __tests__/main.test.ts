import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

it('runs an action with the env/stdout protocol', () => {
  process.env['INPUT_IMAGE'] = 'interficie/helvetia-php'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptionsWithStringEncoding = {
    env: process.env,
    encoding: 'utf8'
  }

  const result = cp.execFileSync(np, [ip], options).trim()
  expect(result).toMatch(/::set-output name=version::[0-9]{4}\.[0-9]{4}\.0/)
})
