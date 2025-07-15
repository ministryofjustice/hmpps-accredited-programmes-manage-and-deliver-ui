import ServiceUserBannerPresenter from './serviceUserBannerPresenter'

describe('ServiceUserBannerPresenter', () => {
  const serviceUser = { name: { forename: 'Dave', surname: 'David' }, dateOfBirth: 'string;', crn: 'X123456' }
  describe('dateOfBirth', () => {
    it('returns a formatted date of birth or not found message', () => {
      serviceUser.dateOfBirth = '1989-02-10'

      const presenterWithDOB = new ServiceUserBannerPresenter(serviceUser)
      expect(presenterWithDOB.dateOfBirth).toEqual('10 February 1989 (36 years old)')
    })
  })

  describe('name', () => {
    it('returns a formatted full name', () => {
      serviceUser.name.forename = 'Ben'
      serviceUser.name.surname = 'jones'

      const presenter = new ServiceUserBannerPresenter(serviceUser)
      expect(presenter.name).toEqual('Ben Jones')
    })
  })

  describe('crn', () => {
    it('returns the service user crn', () => {
      const presenter = new ServiceUserBannerPresenter(serviceUser)

      expect(presenter.crn).toEqual('X123456')
    })
  })
})
