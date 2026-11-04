import fs from 'fs'

describe('app insights compatibility', () => {
  it('uses bunyan v1', () => {
    // See https://github.com/Microsoft/node-diagnostic-channel/blob/master/src/diagnostic-channel-publishers/README.md
    const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    // eslint-disable-next-line no-useless-escape
    expect(packageData.dependencies.bunyan).toMatch(/[^\.]1\..*/)
  })

  it('pins OpenTelemetry core v2 for compatibility with the telemetry SDK', () => {
    const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    const lockfile = JSON.parse(fs.readFileSync('./package-lock.json', 'utf-8'))
    const coreVersion = packageData.overrides['@opentelemetry/core']

    expect(coreVersion).toMatch(/^2\.\d+\.\d+$/)
    expect(lockfile.packages['node_modules/@opentelemetry/core'].version).toBe(coreVersion)
  })
})
