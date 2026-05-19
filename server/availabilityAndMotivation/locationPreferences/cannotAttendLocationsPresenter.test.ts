import CannotAttendLocationsPresenter from './cannotAttendLocationsPresenter'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'
import deliveryLocationPreferencesFormDataFactory from '../../testutils/factories/deliveryLocationPreferences/deliveryLocationPreferencesFormDataFactory'

describe('CannotAttendLocationsPresenter', () => {
  const referralId = 'ref-123'
  const referralDetails = referralDetailsFactory.build()
  const preferredLocationReferenceData = deliveryLocationPreferencesFormDataFactory.build()
  const backLinkUri = '/some/backlink'

  it('should return the correct page title', () => {
    const presenter = new CannotAttendLocationsPresenter(
      referralId,
      referralDetails,
      preferredLocationReferenceData,
      backLinkUri,
    )
    expect(presenter.pageTitle).toEqual('Locations the person cannot attend')
  })

  it('should return the correct backLinkUri', () => {
    const presenter = new CannotAttendLocationsPresenter(
      referralId,
      referralDetails,
      preferredLocationReferenceData,
      backLinkUri,
    )
    expect(presenter.backLinkUri).toEqual(backLinkUri)
  })

  it('should return the correct cannotAttendLocationsRadioButton value when cannotAttendLocations is present', () => {
    const preferredLocationReferenceDataWithCannotAttend = deliveryLocationPreferencesFormDataFactory.build({
      existingDeliveryLocationPreferences: {
        cannotAttendLocations: 'Some location',
        canAttendLocationsValues: [],
      },
    })
    const presenter = new CannotAttendLocationsPresenter(
      referralId,
      referralDetails,
      preferredLocationReferenceDataWithCannotAttend,
      backLinkUri,
    )
    expect(presenter.fields.cannotAttendLocationsRadioButton.value).toEqual('yes')
  })

  it('should return the correct cannotAttendLocationsRadioButton value when cannotAttendLocations is not present', () => {
    const preferredLocationReferenceDataWithoutCannotAttend = deliveryLocationPreferencesFormDataFactory.build({
      existingDeliveryLocationPreferences: {
        cannotAttendLocations: null,
        canAttendLocationsValues: [],
      },
    })
    const presenter = new CannotAttendLocationsPresenter(
      referralId,
      referralDetails,
      preferredLocationReferenceDataWithoutCannotAttend,
      backLinkUri,
    )
    expect(presenter.fields.cannotAttendLocationsRadioButton.value).toEqual('no')
  })

  it('should return null for cannotAttendLocationsRadioButton value if no existingDeliveryLocationPreferences', () => {
    const preferredLocationReferenceDataNoPrefs = deliveryLocationPreferencesFormDataFactory.build({
      existingDeliveryLocationPreferences: null,
    })
    const presenter = new CannotAttendLocationsPresenter(
      referralId,
      referralDetails,
      preferredLocationReferenceDataNoPrefs,
      backLinkUri,
    )
    expect(presenter.fields.cannotAttendLocationsRadioButton.value).toEqual('')
  })
})
