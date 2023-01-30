/* eslint-disable no-console */
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_IMAGE'] = 'interficie/helvetia-php'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptionsWithStringEncoding = {
    env: process.env,
    encoding: 'utf8'
  }
  try {
    const result = cp.execFileSync(np, [ip], options)
    console.log(result)
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'stdout' in err &&
      typeof err.stdout === 'object' &&
      err.stdout !== null &&
      'toString' in err.stdout &&
      typeof err.stdout.toString === 'function'
    ) {
      console.error(err.stdout.toString())
    } else {
      console.error(`Unknown error running "${np} ${ip}"`)
    }
  }
})
