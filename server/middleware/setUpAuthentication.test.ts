import { buildSignOutRedirectUri, validatePath } from './setUpAuthentication'

describe('setUpAuthentication helpers', () => {
  describe('check return path is safe', () => {
    it('keeps normal in-app page paths', () => {
      expect(validatePath('/referral/123')).toBe('/referral/123')
      expect(validatePath('/group/1?tab=details')).toBe('/group/1?tab=details')
    })

    it('blocks full website links and protocol-style links', () => {
      expect(validatePath('//evil.com/path')).toBe('')
      expect(validatePath('https://example.com/path')).toBe('')
    })

    it('blocks paths that do not start with a slash', () => {
      expect(validatePath('referral/123')).toBe('')
    })
  })

  describe('build sign-out return URL', () => {
    const ingressUrl = 'http://localhost:3000'

    it('adds a safe return page to the app URL', () => {
      expect(buildSignOutRedirectUri(ingressUrl, '/referral/123?tab=notes')).toBe(
        'http://localhost:3000?returnTo=%2Freferral%2F123%3Ftab%3Dnotes',
      )
    })

    it('uses the app home URL when return page is unsafe', () => {
      expect(buildSignOutRedirectUri(ingressUrl, '//evil.com')).toBe('http://localhost:3000')
      expect(buildSignOutRedirectUri(ingressUrl, 'https://example.com/path')).toBe('http://localhost:3000')
      expect(buildSignOutRedirectUri(ingressUrl, 'group/1')).toBe('http://localhost:3000')
    })
  })
})
