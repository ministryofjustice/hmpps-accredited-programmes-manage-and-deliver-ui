import path from 'path'
import fs from 'fs'
import nunjucks from 'nunjucks'
import { load } from 'cheerio'

const environment = nunjucks.configure(
  [path.join(__dirname, '..'), 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

environment.addFilter('assetMap', (url: string) => url)

describe('layout main content', () => {
  const templates = [
    'partials/layout.njk',
    'referralDetails/referralDetails.njk',
    'attendanceHistory/attendanceHistory.njk',
    'availabilityAndMotivation/addAvailability/addAvailability.njk',
    'updateReferralStatus/updateReferralStatus.njk',
    'createGroup/createGroupCode.njk',
  ]

  it.each(templates)('renders a full-width banner inside the single main landmark in %s', template => {
    const $ = load(
      environment.render(template, {
        primaryNavigationArgs: {},
        radioArgs: () => ({}),
        getCurrentStatusTimelineOptions: () => ({}),
        presenter: {
          getHorizontalSubNavArgs: () => ({ items: [{ text: 'Referral details', href: '/referral-details' }] }),
          getVerticalSubNavArgs: () => ({}),
        },
        serviceUserBannerPresenter: {
          name: 'Test Person',
          crn: 'X123456',
          crnForScreenReader: 'X 1 2 3 4 5 6',
          dateOfBirth: '1 January 1980',
        },
      }),
    )

    expect($('main')).toHaveLength(1)
    expect($('#main-content')).toHaveLength(1)
    expect($('.govuk-skip-link').attr('href')).toBe('#main-content')
    expect($('#main-content').is('main')).toBe(true)
    expect($('#main-content > .key-details-bar')).toHaveLength(1)
    expect($('.key-details-bar').parents('.govuk-width-container')).toHaveLength(0)
    expect($('.key-details-bar__key-details').hasClass('govuk-width-container')).toBe(true)
    expect($('.key-details-bar__name').text()).toContain('Test Person')
    expect($('#main-content > .service-user-banner__sub-nav')).toHaveLength(1)
    expect($('.service-user-banner__sub-nav').next().hasClass('govuk-width-container')).toBe(true)
    expect($('.govuk-main-wrapper').closest('main').attr('id')).toBe('main-content')
    expect($('.govuk-template__header .key-details-bar')).toHaveLength(0)
  })

  it.each([...templates, 'home/home.njk'])('preserves a single main landmark without a banner in %s', template => {
    const $ = load(
      environment.render(template, {
        primaryNavigationArgs: {},
        radioArgs: () => ({}),
        getCurrentStatusTimelineOptions: () => ({}),
        presenter: { getVerticalSubNavArgs: () => ({}) },
      }),
    )

    expect($('main')).toHaveLength(1)
    expect($('#main-content')).toHaveLength(1)
    expect($('.govuk-main-wrapper')).toHaveLength(1)
    expect($('.key-details-bar')).toHaveLength(0)
    expect($('.service-user-banner__sub-nav')).toHaveLength(0)
  })

  it('renders the banner and page content without referral sub-navigation', () => {
    const $ = load(
      environment.render('partials/layout.njk', {
        primaryNavigationArgs: {},
        serviceUserBannerPresenter: { name: 'Test Person' },
      }),
    )

    expect($('#main-content > .key-details-bar')).toHaveLength(1)
    expect($('#main-content > .govuk-width-container > .govuk-main-wrapper')).toHaveLength(1)
    expect($('.service-user-banner__sub-nav')).toHaveLength(0)
  })

  it('preserves GOV.UK container and main attributes', () => {
    const $ = load(
      environment.render('partials/layout.njk', {
        primaryNavigationArgs: {},
        mainClasses: 'app-container govuk-body',
        mainLang: 'cy',
        mainAttributes: { 'data-main': 'test' },
        containerClasses: 'custom-container',
        containerAttributes: { 'data-container': 'test' },
      }),
    )

    expect($('#main-content').attr('lang')).toBe('cy')
    expect($('#main-content').attr('data-main')).toBe('test')
    expect($('#main-content > .govuk-width-container').hasClass('custom-container')).toBe(true)
    expect($('#main-content > .govuk-width-container').attr('data-container')).toBe('test')
    expect($('.govuk-main-wrapper').hasClass('app-container')).toBe(true)
    expect($('.govuk-main-wrapper').hasClass('govuk-body')).toBe(true)
  })
})

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

    const footer = `<footer class="probation-common-footer"><a href="${componentApiUrl}/accessibility-statement">Accessibility</a><a href="${componentApiUrl}/cookies-policy">Cookies policy</a><a href="${componentApiUrl}/privacy-policy">Privacy policy</a></footer>`
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
      `${componentApiUrl}/accessibility-statement`,
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
