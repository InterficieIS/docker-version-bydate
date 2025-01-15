import {jest} from '@jest/globals'

const fetchCounter = jest.fn<typeof import('../src/fetchCounter.js').default>()

export default fetchCounter
