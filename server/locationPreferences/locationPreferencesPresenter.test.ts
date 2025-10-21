import { randomUUID } from 'crypto'

import LocationPreferencesPresenter from './locationPreferencesPresenter'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import deliveryLocationPreferencesFormDataFactory from '../testutils/factories/deliveryLocationPreferences/deliveryLocationPreferencesFormDataFactory'
import createDeliveryLocationPreferencesFactory from '../testutils/factories/deliveryLocationPreferences/createDeliveryLocationPreferencesFactory'

afterEach(() => {
  jest.restoreAllMocks()
})

describe('locationsPreferencesPresenter.', () => {
  const referralId = randomUUID()
  const referralDetails = referralDetailsFactory.build()
  const updateData = createDeliveryLocationPreferencesFactory.build()

  it('The backlink uri should be set correctly based on the referral id', () => {
    const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory.build()

    const presenter = new LocationPreferencesPresenter(
      referralId,
      referralDetails,
      preferredLocationDetails,
      updateData,
    )

    expect(presenter.backLinkUri).toEqual(`/referral-details/${referralId}/location#location`)
  })

  it('The locationButtonFormAction uri should be set correctly based on the referral id', () => {
    const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory.build()

    const presenter = new LocationPreferencesPresenter(
      referralId,
      referralDetails,
      preferredLocationDetails,
      updateData,
    )

    expect(presenter.backLinkUri).toEqual(`/referral-details/${referralId}/location#location`)
  })

  describe('hasPreviouslySelectedOtherPdus.', () => {
    it('should return true if there have been offices selected for the non-primary pdu previously', () => {
      const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory
        .existingDeliveryLocationPreferences()
        .build()

      const presenter = new LocationPreferencesPresenter(
        referralId,
        referralDetails,
        preferredLocationDetails,
        updateData,
      )

      expect(presenter.hasPreviouslySelectedOtherPdus).toEqual(true)
    })

    it('should return false if there are no previously selected offices outside of the primary pdu', () => {
      const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory.build({
        existingDeliveryLocationPreferences: {
          canAttendLocationsValues: [{ label: 'primary PDU Office Location', value: 'OFF-001' }],
        },
      })

      const presenter = new LocationPreferencesPresenter(
        referralId,
        referralDetails,
        preferredLocationDetails,
        null, // no updateData
      )

      expect(presenter.hasPreviouslySelectedOtherPdus).toEqual(false)
    })
  })

  describe('selectedLocationValues.', () => {
    it('should return the offices within the update data for a given pdu if update data exists.', () => {
      const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory.build()

      const presenter = new LocationPreferencesPresenter(
        referralId,
        referralDetails,
        preferredLocationDetails,
        updateData,
      )

      expect(presenter.selectedLocationValues(updateData, 'LDN')).toEqual(['LDN1', 'LDN2', 'LDN3'])
    })

    it('should return offices within the existing delivery location preferences if it exists and update data does not', () => {
      const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory
        .existingDeliveryLocationPreferences()
        .build()

      const presenter = new LocationPreferencesPresenter(
        referralId,
        referralDetails,
        preferredLocationDetails,
        null, // no updateData
      )

      expect(presenter.selectedLocationValues(updateData, 'LDN')).toEqual(['OFF-999'])
    })

    it('should return an empty array if there is no updateData and no existing delivery location preferences', () => {
      const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory.build()

      const presenter = new LocationPreferencesPresenter(
        referralId,
        referralDetails,
        preferredLocationDetails,
        null, // no updateData
      )

      expect(presenter.selectedLocationValues(updateData, 'LDN')).toEqual([])
    })
  })
})
