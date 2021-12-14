import {getInput, setFailed, setOutput} from '@actions/core'
import fetchCounter from './fetchCounter'

async function run(): Promise<void> {
  try {
    const image: string = getInput('image')
    const date = new Date().toISOString().substr(0, 10).split('-')
    const prefix = `${date[0]}.${date[1]}${date[2]}`
    const counter = await fetchCounter(image, prefix)

    setOutput('version', `${prefix}.${counter}`)
  } catch (error) {
    setFailed((error as Error).message)
  }
}

run()
  // eslint-disable-next-line github/no-then
  .then(() => {})
  // eslint-disable-next-line github/no-then
  .catch(error => {
    setFailed(error.message)
  })
