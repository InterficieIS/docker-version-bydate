import {jest} from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import fetchCounter from '../__fixtures__/fetchCounter.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/fetchCounter.js', () => ({
  default: fetchCounter
}))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const {run} = await import('../src/main.js')

describe('action', () => {
  beforeEach(() => {})

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('sets the time output', async () => {
    // Set the action's inputs as return values from core.getInput()
    core.getInput.mockClear().mockImplementation(() => 'test')
    fetchCounter.mockClear().mockImplementation(() => Promise.resolve(0))

    await run()

    expect(fetchCounter).toHaveBeenCalledWith(
      'test',
      expect.stringMatching(/[0-9]{4}\.[0-9]{4}/)
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'version',
      expect.stringMatching(/[0-9]{4}\.[0-9]{4}\.0/)
    )
    expect(core.error).not.toHaveBeenCalled()
  })
})
