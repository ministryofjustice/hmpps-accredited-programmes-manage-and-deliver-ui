import fs from 'fs'

describe('app insights compatibility', () => {
  it('uses bunyan v2', () => {
    // See https://github.com/microsoft/node-diagnostic-channel/tree/main/src/diagnostic-channel-publishers
    const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

    expect(packageData.dependencies.bunyan).toMatch(/^[~^]?2\./)
  })
})
