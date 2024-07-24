import {getInput, setFailed, setOutput} from '@actions/core'
import fetchCounter from './fetchCounter'

export async function run(): Promise<void> {
  try {
    const image: string = getInput('image')
    const date = new Date().toISOString().slice(0, 10).split('-')
    const prefix = `${date[0]}.${date[1]}${date[2]}`
    const counter = await fetchCounter(image, prefix)

    setOutput('version', `${prefix}.${counter}`)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}
