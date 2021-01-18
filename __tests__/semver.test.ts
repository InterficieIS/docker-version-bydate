import {compare, validate} from '../src/semver'

function toSymbol(result: -1 | 0 | 1): '>' | '=' | '<' {
  switch (result) {
    case 1:
      return '>'
    case 0:
      return '='
    case -1:
      return '<'
  }
}

describe('compare versions', () => {
  test.each([
    ['10', '9', '>'],
    ['10', '10', '='],
    ['9', '10', '<']
  ])('single-segment %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })

  test.each([
    ['10.8', '10.4', '>'],
    ['10.1', '10.1', '='],
    ['10.1', '10.2', '<']
  ])('single-segment %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })

  test.each([
    ['10.1.8', '10.0.4', '>'],
    ['10.0.1', '10.0.1', '='],
    ['10.1.1', '10.2.2', '<']
  ])('three-segment %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })

  test.each([
    ['1.0.0.0', '1', '='],
    ['1.0.0.0', '1.0', '='],
    ['1.0.0.0', '1.0.0', '='],
    ['1.0.0.0', '1.0.0.0', '='],
    ['1.2.3.4', '1.2.3.4', '='],
    ['1.2.3.4', '1.2.3.04', '='],
    ['v1.2.3.4', '01.2.3.4', '='],
    ['1.2.3.4', '1.2.3.5', '<'],
    ['1.2.3.5', '1.2.3.4', '>'],
    ['1.0.0.0-alpha', '1.0.0-alpha', '='],
    ['1.0.0.0-alpha', '1.0.0.0-beta', '<']
  ])('four-segment version %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })

  test.each([
    ['11.0.10', '11.0.2', '>'],
    ['11.0.2', '11.0.10', '<'],
    ['1.1.1', '1', '>'],
    ['1.0.0', '1', '='],
    ['1.0', '1.4.1', '<']
  ])('different number of digits %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })

  test.each([['11.1.10', '11.0', '>']])(
    'different number of digits in different groups %s %s %s',
    (v1, v2, expected) => {
      expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
    }
  )

  test.each([
    ['1.0.0-alpha.1', '1.0.0-alpha', '>'],
    ['1.0.0-alpha', '1.0.0-alpha.1', '<'],
    ['1.0.0-alpha.1', '1.0.0-alpha.beta', '<'],
    ['1.0.0-alpha.beta', '1.0.0-beta', '<'],
    ['1.0.0-beta', '1.0.0-beta.2', '<'],
    ['1.0.0-beta.2', '1.0.0-beta.11', '<'],
    ['1.0.0-beta.11', '1.0.0-rc.1', '<'],
    ['1.0.0-rc.1', '1.0.0', '<'],
    ['1.0.0-alpha', '1', '<']
  ])('pre-release versions %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })

  test.each([
    ['1.4.0-build.3928', '1.4.0-build.3928+sha.a8d9d4f', '='],
    ['1.4.0-build.3928+sha.b8dbdb0', '1.4.0-build.3928+sha.a8d9d4f', '='],
    ['1.0.0-alpha+001', '1.0.0-alpha', '='],
    ['1.0.0-beta+exp.sha.5114f85', '1.0.0-beta+exp.sha.999999', '='],
    ['1.0.0+20130313144700', '1.0.0', '='],
    ['1.0.0+20130313144700', '2.0.0', '<'],
    ['1.0.0+20130313144700', '1.0.1+11234343435', '<'],
    ['1.0.1+1', '1.0.1+2', '='],
    ['1.0.0+a-a', '1.0.0+a-b', '=']
  ])('versions with build metadata %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })

  test.each([
    ['v1.0.0', '1.0.0', '='],
    ['v1.0.0', 'v1.0.0', '='],
    ['v1.0.0', 'v1.0.0', '='],
    ['v1.0.0-alpha', '1.0.0-alpha', '=']
  ])('ignores leading "v" %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })

  test.each([
    ['01.0.0', '1', '='],
    ['01.0.0', '1.0.0', '='],
    ['1.01.0', '1.01.0', '='],
    ['1.0.03', '1.0.3', '='],
    ['1.0.03-alpha', '1.0.3-alpha', '='],
    ['v01.0.0', '1.0.0', '='],
    ['v01.0.0', '2.0.0', '<']
  ])('ignores leading "0" %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })

  test.each([
    ['0.1.20', '0.1.5', '>'],
    ['0.6.1-1', '0.6.1-0', '>'],
    ['0.7.x', '0.6.0', '>'],
    ['0.7.x', '0.6.0-asdf', '>'],
    ['0.7.x', '0.6.2', '>'],
    ['0.7.x', '0.7.0-asdf', '>'],
    ['1', '0.0.0-beta', '>'],
    ['1', '0.2.3', '>'],
    ['1', '0.2.4', '>'],
    ['1', '1.0.0-0', '>'],
    ['1', '1.0.0-beta', '>'],
    ['1.0', '0.0.0', '>'],
    ['1.0', '0.1.0', '>'],
    ['1.0', '0.1.2', '>'],
    ['1.0.0', '0.0.0', '>'],
    ['1.0.0', '0.0.1', '>'],
    ['1.0.0', '0.2.3', '>'],
    ['1.0.0-beta.2', '1.0.0-beta.1', '>'],
    ['1.2.*', '1.1.3', '>'],
    ['1.2.*', '1.1.9999', '>'],
    ['1.2.2', '1.2.1', '>'],
    ['1.2.x', '1.0.0', '>'],
    ['1.2.x', '1.1.0', '>'],
    ['1.2.x', '1.1.3', '>'],
    ['2', '1.0.0', '>'],
    ['2', '1.0.0-beta', '>'],
    ['2', '1.9999.9999', '>'],
    ['2.*.*', '1.0.1', '>'],
    ['2.*.*', '1.1.3', '>'],
    ['2.0.0', '1.0.0', '>'],
    ['2.0.0', '1.1.1', '>'],
    ['2.0.0', '1.2.9', '>'],
    ['2.0.0', '1.9999.9999', '>'],
    ['2.3', '2.2.1', '>'],
    ['2.3', '2.2.2', '>'],
    ['2.4', '2.3.0', '>'],
    ['2.4', '2.3.5', '>'],
    ['2.x.x', '1.0.0', '>'],
    ['2.x.x', '1.1.3', '>'],
    ['3.2.1', '2.3.2', '>'],
    ['3.2.1', '3.2.0', '>'],
    ['v0.5.4-pre', '0.5.4-alpha', '>'],
    ['v3.2.1', 'v2.3.2', '>']
  ])('unclassified test %s %s %s', (v1, v2, expected) => {
    expect(toSymbol(compare(v1, v2))).toStrictEqual(expected)
  })
})

describe('version validation', () => {
  test.each([
    [42, /Invalid argument expected string/],
    [{}, /Invalid argument expected string/],
    [[], /Invalid argument expected string/],
    [() => undefined, /Invalid argument expected string/],
    ['6.3.', /Invalid argument not valid semver/],
    ['1.2.3a', /Invalid argument not valid semver/],
    ['1.2.-3a', /Invalid argument not valid semver/]
  ])('%p %s', (v1, exception) => {
    expect(validate(v1)).toStrictEqual(false)
  })
})
