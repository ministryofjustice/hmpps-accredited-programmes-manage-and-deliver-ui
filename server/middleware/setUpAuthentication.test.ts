import { buildSignOutRedirectUri, validatePath } from './setUpAuthentication'

describe('setUpAuthentication helpers', () => {
  describe('validatePath', () => {
    it('returns internal paths unchanged', () => {
      expect(validatePath('/referral/123')).toBe('/referral/123')
      expect(validatePath('/group/1?tab=details')).toBe('/group/1?tab=details')
    })

    it('rejects protocol-relative and absolute external URLs', () => {
      expect(validatePath('//evil.com/path')).toBe('')
      expect(validatePath('https://example.com/path')).toBe('')
    })

    it('rejects non-rooted relative paths', () => {
      expect(validatePath('referral/123')).toBe('')
    })
  })

  describe('buildSignOutRedirectUri', () => {
    const ingressUrl = 'http://localhost:3000'

    it('appends a safe returnTo to ingress URL', () => {
      expect(buildSignOutRedirectUri(ingressUrl, '/referral/123?tab=notes')).toBe(
        'http://localhost:3000?returnTo=%2Freferral%2F123%3Ftab%3Dnotes',
      )
    })

    it('falls back to ingress URL when returnTo is unsafe', () => {
      expect(buildSignOutRedirectUri(ingressUrl, '//evil.com')).toBe('http://localhost:3000')
      expect(buildSignOutRedirectUri(ingressUrl, 'https://example.com/path')).toBe('http://localhost:3000')
      expect(buildSignOutRedirectUri(ingressUrl, 'group/1')).toBe('http://localhost:3000')
    })
  })
})
