import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import AvailabilityAndMotivationPresenter, {
  AvailabilityAndMotivationPageSelection,
} from './availabilityAndMotivationPresenter'

describe('AvailabilityAndMotivationPresenter', () => {
  describe('pageTitle', () => {
    it('returns the correct title for Location tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new AvailabilityAndMotivationPresenter(
        referral,
        AvailabilityAndMotivationPageSelection.LocationTab,
      )

      expect(presenter.pageTitle).toBe('Location - Availability and motivation')
    })

    it('returns the correct title for Motivation, background and non-associations tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new AvailabilityAndMotivationPresenter(
        referral,
        AvailabilityAndMotivationPageSelection.MotivationBackgroundAndNonAssociationsTab,
      )

      expect(presenter.pageTitle).toBe('Add motivation, background and non-associations - Availability and motivation')
    })

    it('returns the default title for Availability tab', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new AvailabilityAndMotivationPresenter(
        referral,
        AvailabilityAndMotivationPageSelection.AvailabilityTab,
      )

      expect(presenter.pageTitle).toBe('Availability - Availability and motivation')
    })
  })

  describe('verticalSubNavArgs', () => {
    it('should set Location item as active when LocationTab is selected', () => {
      const referral = referralDetailsFactory.build({ id: 'test-id-123' })
      const presenter = new AvailabilityAndMotivationPresenter(
        referral,
        AvailabilityAndMotivationPageSelection.LocationTab,
      )

      const navArgs = presenter.verticalSubNavArgs
      const locationItem = navArgs.items[1]

      expect(locationItem.text).toBe('Location')
      expect(locationItem.active).toBe(true)
      expect(locationItem.href).toBe('/referral/test-id-123/availability-and-motivation/location/#location')
    })

    it('should set Motivation item as active when MotivationBackgroundAndNonAssociationsTab is selected', () => {
      const referral = referralDetailsFactory.build({ id: 'test-id-456' })
      const presenter = new AvailabilityAndMotivationPresenter(
        referral,
        AvailabilityAndMotivationPageSelection.MotivationBackgroundAndNonAssociationsTab,
      )

      const navArgs = presenter.verticalSubNavArgs
      const motivationItem = navArgs.items[2]

      expect(motivationItem.text).toBe('Motivation, background and non-associations')
      expect(motivationItem.active).toBe(true)
      expect(motivationItem.href).toBe(
        '/referral/test-id-456/availability-and-motivation/motivation-background-and-non-associations/#motivation-background-and-non-associations',
      )
    })

    it('should set Availability item as active when AvailabilityTab is selected', () => {
      const referral = referralDetailsFactory.build({ id: 'test-id-789' })
      const presenter = new AvailabilityAndMotivationPresenter(
        referral,
        AvailabilityAndMotivationPageSelection.AvailabilityTab,
      )

      const navArgs = presenter.verticalSubNavArgs
      const availabilityItem = navArgs.items[0]

      expect(availabilityItem.text).toBe('Availability')
      expect(availabilityItem.active).toBe(true)
      expect(availabilityItem.href).toBe('/referral/test-id-789/availability-and-motivation/availability/#availability')
    })

    it('should have correct classes and all items with correct attributes', () => {
      const referral = referralDetailsFactory.build()
      const presenter = new AvailabilityAndMotivationPresenter(
        referral,
        AvailabilityAndMotivationPageSelection.AvailabilityTab,
      )

      const navArgs = presenter.verticalSubNavArgs

      expect(navArgs.classes).toBe('govuk-!-padding-top-0')
      expect(navArgs.items).toHaveLength(3)
      expect(navArgs.items[0].attributes).toEqual({ id: 'availability' })
      expect(navArgs.items[1].attributes).toEqual({ id: 'location' })
      expect(navArgs.items[2].attributes).toEqual({
        id: 'motivation-background-and-non-associations',
      })
    })
  })
})
