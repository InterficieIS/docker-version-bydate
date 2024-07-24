import * as core from '@actions/core'
import * as fetchCounter from '../src/fetchCounter'
import * as main from '../src/main'

// Mock the GitHub Actions core library
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
// let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>
let fetchCounterMock: jest.SpiedFunction<typeof fetchCounter.default>

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    // setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
    fetchCounterMock = jest.spyOn(fetchCounter, 'default')
  })

  it('sets the time output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(() => 'test')
    fetchCounterMock.mockImplementation(() => Promise.resolve(0))

    await main.run()

    expect(runMock).toHaveReturned()
    expect(fetchCounterMock).toHaveBeenCalledWith(
      'test',
      expect.stringMatching(/[0-9]{4}\.[0-9]{4}/)
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'version',
      expect.stringMatching(/[0-9]{4}\.[0-9]{4}\.0/)
    )
    expect(errorMock).not.toHaveBeenCalled()
  })
})
