import offenceHistoryFactory from '../testutils/factories/offenceHistoryFactory'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import OffenceHistoryPresenter from './offenceHistoryPresenter'

describe('OffenceHistoryPresenter', () => {
  describe('pageTitle', () => {
    it('returns the correct page title', () => {
      const referral = referralDetailsFactory.build()
      const offenceHistory = offenceHistoryFactory.build()
      const presenter = new OffenceHistoryPresenter(referral, 'offenceHistory', offenceHistory)

      expect(presenter.pageTitle).toBe('Offence history - Referral details')
    })
  })

  describe('offenceHistorySummaryLists', () => {
    it('returns summary lists with index offence and additional offences', () => {
      const referral = referralDetailsFactory.build()
      const offenceHistory = offenceHistoryFactory.build()
      const presenter = new OffenceHistoryPresenter(referral, 'offenceHistory', offenceHistory)

      const summaries = presenter.offenceHistorySummaryLists()

      expect(summaries).toHaveLength(2)
      expect(summaries[0].title).toBe('Index offence')
      expect(summaries[0].summary[0].key).toBe('Offence')
      expect(summaries[0].summary[0].lines[0]).toContain(offenceHistory.mainOffence.offenceCode)
      expect(summaries[0].summary[1].key).toBe('Category')
      expect(summaries[0].summary[2].key).toBe('Offence date')

      expect(summaries[1].title).toBe('Additional offence (08000)')
      expect(summaries[1].summary[0].lines).toContain('An offence - 08000')
    })
  })
})
