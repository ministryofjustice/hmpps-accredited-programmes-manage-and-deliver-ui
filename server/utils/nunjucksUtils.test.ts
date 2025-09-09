import NunjucksUtils from './nunjucksUtils'

describe('NunjucksUtils', () => {
  describe('objectMerge', () => {
    it('takes two objects and merges the second into the first', () => {
      expect(NunjucksUtils.objectMerge({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 })
    })
  })
})
