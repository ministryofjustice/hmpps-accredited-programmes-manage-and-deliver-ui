import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import UpdateReferralStatusPreGroupAttendancePresenter from './updateReferralStatusPreGroupAttendancePresenter'

describe('UpdateReferralStatusPreGroupAttendancePresenter', () => {
  it('provides the page title, personalised heading and group sessions URL', () => {
    const details = referralDetailsFactory.build({ personName: 'Alex River' })
    const presenter = new UpdateReferralStatusPreGroupAttendancePresenter(details, 'group-123', '/back', '/cancel')

    expect(presenter.pageTitle).toEqual('Record pre-group attendance')
    expect(presenter.heading).toEqual('Alex River must attend their pre-group one-to-one to be On programme')
    expect(presenter.groupSessionsAndAttendanceUri).toEqual('/group/group-123/sessions-and-attendance')
  })
})
