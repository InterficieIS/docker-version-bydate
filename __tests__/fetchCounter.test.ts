import fetchCounter from '../src/fetchCounter'
import {ResponseData} from '../src/types'

describe('fetchCounter', () => {
  test('returns 0 when there are no versions', () => {
    const fetcher = (_image: string): Promise<ResponseData> =>
      Promise.resolve({
        results: []
      })

    expect(
      fetchCounter('some/thing', '2021.0118.', {fetcher})
    ).resolves.toStrictEqual(0)
  })

  test('returns 1 when there is only one version .0', () => {
    const fetcher = (_image: string): Promise<ResponseData> =>
      Promise.resolve({
        results: [{name: '2021.0118.0'}]
      })

    expect(
      fetchCounter('some/thing', '2021.0118.', {fetcher})
    ).resolves.toStrictEqual(1)
  })

  test('returns 5 when the latest version is .4', () => {
    const fetcher = (_image: string): Promise<ResponseData> =>
      Promise.resolve({
        results: [
          {name: '2021.0118.1'},
          {name: '2021.0118.4'},
          {name: '2021.0118.3'}
        ]
      })

    expect(
      fetchCounter('some/thing', '2021.0118.', {fetcher})
    ).resolves.toStrictEqual(5)
  })
})
