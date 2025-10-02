import StatusHistoryPresenter from './statusHistoryPresenter'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import statusHistoryFactory from '../testutils/factories/statusHistoryFactory'

describe('StatusHistoryPresenter', () => {
  describe('successMessageSummary', () => {
    it('returns success message when isShowStatusUpdateMessageVisible is true', () => {
      const referralDetails = referralDetailsFactory.build({
        personName: 'John Doe',
        currentStatusDescription: 'Assessment complete',
      })
      const statusHistory = [statusHistoryFactory.awaitingAssessment().build()]

      const presenter = new StatusHistoryPresenter(
        'referral-id',
        statusHistory,
        referralDetails,
        true, // isShowStatusUpdateMessageVisible is true
      )

      const successMessage = presenter.successMessageSummary

      expect(successMessage).toEqual({
        title: 'Referral status updated',
        text: "John Doe's referral status is now Assessment complete",
        variant: 'success',
        showTitleAsHeading: true,
      })
    })

    it('returns null when isShowStatusUpdateMessageVisible is false', () => {
      const referralDetails = referralDetailsFactory.build({
        personName: 'John Doe',
        currentStatusDescription: 'Assessment complete',
      })
      const statusHistory = [statusHistoryFactory.awaitingAssessment().build()]

      const presenter = new StatusHistoryPresenter(
        'referral-id',
        statusHistory,
        referralDetails,
        false, // isShowStatusUpdateMessageVisible is false
      )

      const successMessage = presenter.successMessageSummary

      expect(successMessage).toBeNull()
    })
  })
})
