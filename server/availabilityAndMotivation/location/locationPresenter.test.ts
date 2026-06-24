import { DeliveryLocationPreferences } from '@manage-and-deliver-api'
import LocationPresenter from './locationPresenter'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'

describe('LocationPresenter', () => {
  it('should return "Add location preferences" when no locations are set', () => {
    const mockDeliveryLocationPreferences = {
      preferredDeliveryLocations: [],
      cannotAttendLocations: null,
    } as DeliveryLocationPreferences

    const mockDetails = referralDetailsFactory.build()
    const presenter = new LocationPresenter(mockDetails, 'location', mockDeliveryLocationPreferences)

    expect(presenter.linkText).toEqual('Add location preferences')
  })

  it('should return "Update location preferences" when preferred locations are set', () => {
    const mockDeliveryLocationPreferences = {
      preferredDeliveryLocations: ['Location 1', 'Location 2'],
      cannotAttendLocations: null,
    } as DeliveryLocationPreferences

    const mockDetails = referralDetailsFactory.build()
    const presenter = new LocationPresenter(mockDetails, 'location', mockDeliveryLocationPreferences)

    expect(presenter.linkText).toEqual('Update location preferences')
  })

  it('should return "Update location preferences" when cannot attend locations are set', () => {
    const mockDeliveryLocationPreferences = {
      preferredDeliveryLocations: [],
      cannotAttendLocations: 'Cannot attend prison locations',
    } as DeliveryLocationPreferences

    const mockDetails = referralDetailsFactory.build()
    const presenter = new LocationPresenter(mockDetails, 'location', mockDeliveryLocationPreferences)

    expect(presenter.linkText).toEqual('Update location preferences')
  })

  it('should return preferred locations summary with last updated info', () => {
    const mockDeliveryLocationPreferences = {
      preferredDeliveryLocations: ['Location A', 'Location B'],
      cannotAttendLocations: 'Cannot attend Location C',
      lastUpdatedAt: '2024-01-15',
      lastUpdatedBy: 'John Smith',
    } as DeliveryLocationPreferences

    const mockDetails = referralDetailsFactory.build()
    const presenter = new LocationPresenter(mockDetails, 'location', mockDeliveryLocationPreferences)

    const summary = presenter.preferredLocationsSummary()

    expect(summary.title).toEqual('Preferred programme delivery locations')
    expect(summary.summary[0].lines).toContain('Last updated 2024-01-15 by John Smith')
    expect(summary.summary[1].lines).toEqual(['Location A', 'Location B'])
    expect(summary.summary[2].lines).toEqual(['Cannot attend Location C'])
  })

  it('should return locations summary with PDU and reporting team', () => {
    const mockDeliveryLocationPreferences = {
      preferredDeliveryLocations: [],
      cannotAttendLocations: null,
    } as DeliveryLocationPreferences

    const mockDetails = referralDetailsFactory.build({
      pdu: 'North PDU',
      reportingTeam: 'Team A',
    })
    const presenter = new LocationPresenter(mockDetails, 'location', mockDeliveryLocationPreferences)

    const summary = presenter.locationsSummary()

    expect(summary.title).toEqual('Reporting locations')
    expect(summary.summary[0].key).toEqual('Probation delivery unit')
    expect(summary.summary[0].lines).toEqual(['North PDU'])
    expect(summary.summary[1].key).toEqual('Reporting team')
    expect(summary.summary[1].lines).toEqual(['Team A'])
  })
})
