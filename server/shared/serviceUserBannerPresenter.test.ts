import { ReferralDetails } from '@manage-and-deliver-api'
import ServiceUserBannerPresenter from './serviceUserBannerPresenter'

describe('ServiceUserBannerPresenter', () => {
  const referralDetails = {
    id: 'aabbadf7-a427-436e-b1a4-f27dd5893c24',
    crn: 'X123456',
    personName: 'David Alex Clarke',
    interventionName: 'Building Choices',
    createdAt: '2025-07-28T11:17:47',
    dateOfBirth: '15 April 1981',
    probationPractitionerName: 'John Alex Dobbs',
    probationPractitionerEmail: 'prob.officer@example.com',
  } as ReferralDetails
  describe('dateOfBirth', () => {
    it('returns a formatted date of birth or not found message', () => {
      referralDetails.dateOfBirth = '1989-02-10'

      const presenterWithDOB = new ServiceUserBannerPresenter(referralDetails)
      expect(presenterWithDOB.dateOfBirth).toEqual('10 February 1989 (37 years old)')
    })
  })

  describe('name', () => {
    it('returns a formatted full name', () => {
      referralDetails.personName = 'Ben jones'

      const presenter = new ServiceUserBannerPresenter(referralDetails)
      expect(presenter.name).toEqual('Ben Jones')
    })
  })

  describe('crn', () => {
    it('returns the service user crn', () => {
      const presenter = new ServiceUserBannerPresenter(referralDetails)

      expect(presenter.crn).toEqual('X123456')
    })
  })
})
