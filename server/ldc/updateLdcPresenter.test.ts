import { ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import UpdateLdcPresenter from './updateLdcPresenter'

describe('UpdateLdcPresenter', () => {
  it('should return the correct page title', () => {
    const referralId = randomUUID()
    const mockDetails = {
      hasLdc: true,
    } as ReferralDetails

    const presenter = new UpdateLdcPresenter(referralId, mockDetails, null)

    expect(presenter.pageTitle).toEqual('Update learning disabilities and challenges')
  })

  it('should expose the backlink URI passed to the constructor', () => {
    const referralId = randomUUID()
    const mockDetails = {
      hasLdc: true,
    } as ReferralDetails

    const presenter = new UpdateLdcPresenter(referralId, mockDetails, '/referral/search')

    expect(presenter.backlinkUri).toEqual('/referral/search')
  })

  it('should return the correct hasLdc value in fields', () => {
    const referralId = randomUUID()
    const mockDetails = {
      hasLdc: false,
    } as ReferralDetails

    const presenter = new UpdateLdcPresenter(referralId, mockDetails, null)

    expect(presenter.fields).toEqual({
      hasLdc: {
        value: false,
      },
    })
  })

  it('should expose the referral ID and details passed to the constructor', () => {
    const referralId = randomUUID()
    const mockDetails = {
      hasLdc: true,
    } as ReferralDetails

    const presenter = new UpdateLdcPresenter(referralId, mockDetails, null)

    expect(presenter.id).toEqual(referralId)
    expect(presenter.details).toEqual(mockDetails)
  })
})
