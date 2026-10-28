import path from 'path'
import fs from 'fs'
import nunjucks from 'nunjucks'
import { load } from 'cheerio'

const environment = nunjucks.configure(
  [path.join(__dirname, '..'), 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

environment.addFilter('assetMap', (url: string) => url)

describe('layout footer', () => {
  it.each([
    ['DEV', 'https://probation-frontend-components-dev.hmpps.service.justice.gov.uk'],
    ['preprod', 'https://probation-frontend-components-preprod.hmpps.service.justice.gov.uk'],
    ['prod', 'https://probation-frontend-components.hmpps.service.justice.gov.uk'],
  ])('renders the %s PDS footer and its assets', (environmentName, componentApiUrl) => {
    const deploymentValues = fs.readFileSync(
      path.join(__dirname, '../../../helm_deploy', `values-${environmentName.toLowerCase()}.yaml`),
      'utf8',
    )
    expect(deploymentValues).toMatch(
      new RegExp(`^\\s+COMPONENT_API_URL: "${componentApiUrl.replace(/\./g, '\\.')}"\\s*$`, 'm'),
    )

    const footer = `<footer class="probation-common-footer"><a href="${componentApiUrl}/accessibility/accredited-programmes">Accessibility</a><a href="${componentApiUrl}/cookies-policy">Cookies policy</a><a href="${componentApiUrl}/privacy-policy">Privacy policy</a></footer>`
    const html = environment.render('partials/layout.njk', {
      applicationName: 'Accredited Programmes',
      environmentName,
      pageTitle: 'Test page',
      primaryNavigationArgs: {},
      presenter: {},
      sentry: {},
      cspNonce: 'test-nonce',
      feComponents: {
        header: '<header id="pds-header">PDS header</header>',
        footer,
        cssIncludes: [`${componentApiUrl}/assets/css/footer.css`],
        jsIncludes: [`${componentApiUrl}/assets/js/footer.js`],
      },
    })
    const $ = load(html)

    expect(html).toContain(footer)
    expect($('footer')).toHaveLength(1)
    expect(
      $('footer a')
        .map((_index, element) => $(element).attr('href'))
        .get(),
    ).toEqual([
      `${componentApiUrl}/accessibility/accredited-programmes`,
      `${componentApiUrl}/cookies-policy`,
      `${componentApiUrl}/privacy-policy`,
    ])
    expect($('#pds-header')).toHaveLength(0)
    expect($('.govuk-template__header')).toHaveLength(1)
    expect($(`head link[href="${componentApiUrl}/assets/css/footer.css"]`).attr('nonce')).toBe('test-nonce')
    expect($(`body script[src="${componentApiUrl}/assets/js/footer.js"]`).attr('nonce')).toBe('test-nonce')
  })

  it('renders without component assets when no components are available', () => {
    const html = environment.render('partials/layout.njk', {
      primaryNavigationArgs: {},
      presenter: {},
      sentry: {},
    })

    const $ = load(html)
    expect($('head link[rel="stylesheet"]')).toHaveLength(1)
    expect($('footer')).toHaveLength(0)
    expect($('script[type="module"]').attr('src')).toBe('/assets/js/index.js')
  })
})
