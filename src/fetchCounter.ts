import * as http from '@actions/http-client'
import {compare, validate} from './semver'
import {ResponseData, Tag} from './types'

function parseResponse(buf: string): unknown {
  try {
    return JSON.parse(buf)
  } catch {
    throw new Error(`Received non-json response from docker hub:\n${buf}`)
  }
}

function isTag(input: unknown): input is Tag {
  if (
    typeof input !== 'object' ||
    input === null ||
    !(input instanceof Object)
  ) {
    return false
  }
  const tag = input as {name?: unknown}
  return 'name' in tag && typeof tag.name === 'string'
}

function isResponseData(input: unknown): input is ResponseData {
  if (
    typeof input !== 'object' ||
    input === null ||
    !(input instanceof Object) ||
    !input.hasOwnProperty('results')
  ) {
    return false
  }

  const obj = input as {results?: unknown}
  return (
    typeof obj.results === 'object' &&
    Array.isArray(obj.results) &&
    obj.results.every(isTag)
  )
}

async function fetchCounter(image: string, prefix: string): Promise<number> {
  const client = new http.HttpClient()
  const response = await client.get(
    `https://hub.docker.com/v2/repositories/${image}/tags?page_size=4`
  )
  if (!response.message.statusCode || response.message.statusCode !== 200) {
    throw new Error(
      `Received non-200 response from docker hub: ${response.message.statusCode} : ${response.message.statusMessage}`
    )
  }
  const data = parseResponse(await response.readBody())
  if (!isResponseData(data)) {
    throw Error(`Unexpected response from registry:\n${data}`)
  }
  const latestVersion: string | undefined = data.results
    .map(tag => tag.name)
    .filter(version => version.startsWith(prefix) && validate(version))
    .sort(compare)
    .pop()

  return latestVersion ? parseInt(latestVersion.slice(8), 10) + 1 : 0
}

export default fetchCounter
