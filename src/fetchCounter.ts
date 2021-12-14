import * as http from '@actions/http-client'
import type {ResponseData, Tag} from './types'
import {compare, validate} from './semver'

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

export async function fetchVersions(image: string): Promise<ResponseData> {
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

  return data
}

async function fetchCounter(
  image: string,
  prefix: string,
  options?: {
    fetcher?: typeof fetchVersions
  }
): Promise<number> {
  const defaults = {fetcher: fetchVersions}
  const config = {...defaults, ...options}

  const data = await config.fetcher(image)
  const latestVersion: string | undefined = data.results
    .map(tag => tag.name)
    .filter(version => version.startsWith(prefix) && validate(version))
    .sort(compare)
    .pop()

  return latestVersion ? parseInt(latestVersion.slice(10), 10) + 1 : 0
}

export default fetchCounter
