import fs from 'fs'

describe('app insights compatibility', () => {
  it('uses bunyan v1', () => {
    // See https://github.com/Microsoft/node-diagnostic-channel/blob/master/src/diagnostic-channel-publishers/README.md
    const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

    expect(packageData.dependencies.bunyan).toMatch(/^[~^]?2\./)
  })
})
