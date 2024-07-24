import fetchCounter from '../src/fetchCounter'
import {ResponseData} from '../src/types.d'

describe('fetchCounter', () => {
  test('returns 0 when there are no versions', () => {
    const fetcher = async (): Promise<ResponseData> =>
      Promise.resolve({
        results: []
      })

    return expect(
      fetchCounter('some/thing', '2021.0118.', {fetcher})
    ).resolves.toStrictEqual(0)
  })

  test('returns 1 when there is only one version .0', () => {
    const fetcher = async (): Promise<ResponseData> =>
      Promise.resolve({
        results: [{name: '2021.0118.0'}]
      })

    return expect(
      fetchCounter('some/thing', '2021.0118.', {fetcher})
    ).resolves.toStrictEqual(1)
  })

  test('returns 5 when the latest version is .4', () => {
    const fetcher = async (): Promise<ResponseData> =>
      Promise.resolve({
        results: [
          {name: '2021.0118.1'},
          {name: '2021.0118.4'},
          {name: '2021.0118.3'}
        ]
      })

    return expect(
      fetchCounter('some/thing', '2021.0118.', {fetcher})
    ).resolves.toStrictEqual(5)
  })
})
