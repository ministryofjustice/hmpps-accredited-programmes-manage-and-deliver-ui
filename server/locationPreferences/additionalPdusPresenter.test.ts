import { randomUUID } from 'crypto'

import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import deliveryLocationPreferencesFormDataFactory from '../testutils/factories/deliveryLocationPreferences/deliveryLocationPreferencesFormDataFactory'
import createDeliveryLocationPreferencesFactory from '../testutils/factories/deliveryLocationPreferences/createDeliveryLocationPreferencesFactory'
import AdditionalPdusPresenter from './additionalPdusPresenter'

afterEach(() => {
  jest.restoreAllMocks()
})

describe(`additionalPdusPresenter.`, () => {
  it('The backlink uri should be set correctly based on the referral id', () => {
    const referralId = randomUUID()
    const referralDetails = referralDetailsFactory.build()
    const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory.build()
    const currentFormData = createDeliveryLocationPreferencesFactory.build()

    const presenter = new AdditionalPdusPresenter(
      referralId,
      referralDetails,
      preferredLocationDetails,
      currentFormData,
      false,
    )

    expect(presenter.backLinkUri).toEqual(`/referral/${referralId}/add-location-preferences`)
  })

  describe(`selectedLocationValues.`, () => {
    it('should return the offices within the update data if they exists and hasUpdatedAdditionalLocationData is set to true.', () => {
      const referralId = randomUUID()
      const referralDetails = referralDetailsFactory.build()
      const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory.build()
      const currentFormData = createDeliveryLocationPreferencesFactory.build()

      const presenter = new AdditionalPdusPresenter(
        referralId,
        referralDetails,
        preferredLocationDetails,
        currentFormData,
        true,
      )

      expect(presenter.selectedLocationValues(currentFormData)).toEqual(['LDN1', 'LDN2', 'LDN3'])
    })

    it('should return an empty array if the update data exists and hasUpdatedAdditionalLocationData is set to false.', () => {
      const referralId = randomUUID()
      const referralDetails = referralDetailsFactory.build()
      const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory.build()
      const currentFormData = createDeliveryLocationPreferencesFactory.build()

      const presenter = new AdditionalPdusPresenter(
        referralId,
        referralDetails,
        preferredLocationDetails,
        currentFormData,
        false,
      )

      expect(presenter.selectedLocationValues(currentFormData)).toEqual([])
    })

    it('should return offices in the existing set delivery location preferences if it exists and update data is missing or hasUpdatedAdditionalLocationData is set to false.', () => {
      const referralId = randomUUID()
      const referralDetails = referralDetailsFactory.build()
      const preferredLocationDetails = deliveryLocationPreferencesFormDataFactory
        .existingDeliveryLocationPreferences()
        .build()
      const currentFormData = createDeliveryLocationPreferencesFactory.build()

      const presenter = new AdditionalPdusPresenter(
        referralId,
        referralDetails,
        preferredLocationDetails,
        currentFormData,
        false,
      )

      expect(presenter.selectedLocationValues(currentFormData)).toEqual(['OFF-999'])
    })
  })
})
