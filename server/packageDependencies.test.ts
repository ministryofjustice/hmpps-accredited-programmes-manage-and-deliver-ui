import fs from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'

describe('app insights compatibility', () => {
  it('uses bunyan v1', () => {
    // See https://github.com/Microsoft/node-diagnostic-channel/blob/master/src/diagnostic-channel-publishers/README.md
    const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    // eslint-disable-next-line no-useless-escape
    expect(packageData.dependencies.bunyan).toMatch(/[^\.]1\..*/)
  })

  it('serves an HTTP probe with telemetry enabled', async () => {
    const { stdout } = await promisify(execFile)(
      process.execPath,
      [
        '-e',
        `
          const assert = require('node:assert/strict')
          const { initialiseTelemetry, flushTelemetry } = require('@ministryofjustice/hmpps-azure-telemetry')
          initialiseTelemetry({ serviceName: 'telemetry-probe-test', debug: true }).startRecording()
          const http = require('node:http')
          const server = http.createServer((request, response) => response.end('pong'))
          server.listen(0, '127.0.0.1', async () => {
            try {
              const response = await fetch('http://127.0.0.1:' + server.address().port + '/ping')
              assert.equal(response.status, 200)
              assert.equal(await response.text(), 'pong')
              await flushTelemetry()
              console.log('Telemetry probe passed')
            } catch (error) {
              console.error(error)
              process.exitCode = 1
            } finally {
              server.close()
            }
          })
        `,
      ],
      { timeout: 10000 },
    )

    expect(stdout).toContain('Telemetry probe passed')
  }, 15000)
})
