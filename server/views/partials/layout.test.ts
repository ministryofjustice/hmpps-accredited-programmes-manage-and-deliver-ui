import path from 'path'
import nunjucks from 'nunjucks'

const environment = nunjucks.configure(
  [path.join(__dirname, '..'), 'node_modules/govuk-frontend/dist/', 'node_modules/@ministryofjustice/frontend/'],
  { autoescape: true },
)

environment.addFilter('assetMap', (url: string) => url)

describe('layout footer', () => {
  it.each([
    [
      'DEV',
      'https://probation-frontend-components-dev.hmpps.service.justice.gov.uk/accessibility/accredited-programmes',
    ],
    [
      'preprod',
      'https://probation-frontend-components-preprod.hmpps.service.justice.gov.uk/accessibility/accredited-programmes',
    ],
    ['prod', 'https://probation-frontend-components.hmpps.service.justice.gov.uk/accessibility/accredited-programmes'],
  ])('uses the %s accessibility statement URL', (environmentName, accessibilityStatementUrl) => {
    const html = environment.render('partials/layout.njk', {
      applicationName: 'Accredited Programmes',
      environmentName,
      pageTitle: 'Test page',
      primaryNavigationArgs: {},
      presenter: {},
      sentry: {},
    })

    expect(html).toContain(`href="${accessibilityStatementUrl}">Accessibility</a>`)
  })
})
