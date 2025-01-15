import * as core from '@actions/core'
import fetchCounter from './fetchCounter.js'

export async function run(): Promise<void> {
  try {
    const image: string = core.getInput('image')
    const date = new Date().toISOString().slice(0, 10).split('-')
    const prefix = `${date[0]}.${date[1]}${date[2]}`
    const counter = await fetchCounter(image, prefix)

    core.setOutput('version', `${prefix}.${counter}`)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : `Unknown error: ${error}`
    core.setFailed(errorMessage)
  }
}
