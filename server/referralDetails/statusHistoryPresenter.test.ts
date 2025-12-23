import StatusHistoryPresenter from './statusHistoryPresenter'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import statusHistoryFactory from '../testutils/factories/statusHistoryFactory'

describe('StatusHistoryPresenter', () => {
  describe('successMessageSummary', () => {
    it('returns success message when a success message is returned from the API', () => {
      const referralDetails = referralDetailsFactory.build({
        personName: 'John Doe',
        currentStatusDescription: 'Assessment complete',
      })
      const statusHistory = [statusHistoryFactory.awaitingAssessment().build()]

      const presenter = new StatusHistoryPresenter(
        'referral-id',
        statusHistory,
        referralDetails,
        "Jennifer Wilson's referral status is now Awaiting allocation. They have been removed from group BCCDD1",
      )

      const successMessage = presenter.successMessageSummary

      expect(successMessage).toEqual({
        title: 'Referral status updated',
        text: "Jennifer Wilson's referral status is now Awaiting allocation. They have been removed from group BCCDD1",
        variant: 'success',
        dismissible: true,
        showTitleAsHeading: true,
      })
    })

    it('returns null when no success message is returned', () => {
      const referralDetails = referralDetailsFactory.build({
        personName: 'John Doe',
        currentStatusDescription: 'Assessment complete',
      })
      const statusHistory = [statusHistoryFactory.awaitingAssessment().build()]

      const presenter = new StatusHistoryPresenter(
        'referral-id',
        statusHistory,
        referralDetails,
        null, // no success message is returned
      )

      const successMessage = presenter.successMessageSummary

      expect(successMessage).toBeNull()
    })
  })
})
