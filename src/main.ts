import * as core from '@actions/core'
import fetchCounter from './fetchCounter'

async function run(): Promise<void> {
  try {
    const image: string = core.getInput('image')
    const date = new Date().toISOString().substr(0, 10).split('-')
    const prefix = `${date[0]}.${date[1]}${date[2]}`
    const counter = await fetchCounter(image, prefix)

    core.setOutput('version', `${prefix}.${counter}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
  // eslint-disable-next-line github/no-then
  .then(() => {})
  // eslint-disable-next-line github/no-then
  .catch(error => {
    core.setFailed(error.message)
  })
