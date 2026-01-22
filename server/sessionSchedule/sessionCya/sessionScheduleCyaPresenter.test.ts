import { ScheduleSessionRequest } from '@manage-and-deliver-api'
import SessionScheduleCyaPresenter from './SessionScheduleCyaPresenter'

describe('SessionScheduleCyaPresenter', () => {
  const linkUrl = '/group-123/module-456'
  const mockSessionDetails: Partial<ScheduleSessionRequest> & { sessionName?: string; referralName?: string } = {
    sessionTemplateId: 'template-123',
    sessionName: 'Getting started one-to-one',
    referralName: 'John Doe',
    referralIds: ['ref-123'],
    facilitators: [
      {
        facilitator: 'Jane Smith',
        facilitatorCode: 'N07B001',
        teamName: 'Team A',
        teamCode: 'N50CAC',
        teamMemberType: 'REGULAR_FACILITATOR',
      },
    ],
    startDate: '15/03/2025',
    startTime: { hour: 9, minutes: 30, amOrPm: 'AM' },
    endTime: { hour: 11, minutes: 0, amOrPm: 'AM' },
  }

  describe('convertTo24Hour', () => {
    let presenter: SessionScheduleCyaPresenter

    beforeEach(() => {
      presenter = new SessionScheduleCyaPresenter(linkUrl, mockSessionDetails)
    })

    it('converts 12 AM to 0 hours', () => {
      const result = presenter.convertTo24Hour(12, 0, 'AM')

      expect(result).toEqual({ hour: 0, minute: 0 })
    })

    it('converts AM hours correctly', () => {
      const result = presenter.convertTo24Hour(9, 30, 'AM')

      expect(result).toEqual({ hour: 9, minute: 30 })
    })

    it('converts 12 PM to 12 hours', () => {
      const result = presenter.convertTo24Hour(12, 0, 'PM')

      expect(result).toEqual({ hour: 12, minute: 0 })
    })

    it('converts PM hours correctly', () => {
      const result = presenter.convertTo24Hour(3, 45, 'PM')

      expect(result).toEqual({ hour: 15, minute: 45 })
    })
  })

  describe('formattedTime', () => {
    it('formats time range correctly for AM times', () => {
      const presenter = new SessionScheduleCyaPresenter(linkUrl, mockSessionDetails)

      expect(presenter.formattedTime).toBe('9:30am to 11am')
    })

    it('formats time range correctly for midday', () => {
      const pmSessionDetails = {
        ...mockSessionDetails,
        startTime: { hour: 12, minutes: 0, amOrPm: 'PM' as const },
        endTime: { hour: 4, minutes: 30, amOrPm: 'PM' as const },
      }
      const presenter = new SessionScheduleCyaPresenter(linkUrl, pmSessionDetails)

      expect(presenter.formattedTime).toBe('midday to 4:30pm')
    })

    it('formats time range correctly crossing AM to PM', () => {
      const mixedSessionDetails = {
        ...mockSessionDetails,
        startTime: { hour: 11, minutes: 30, amOrPm: 'AM' as const },
        endTime: { hour: 1, minutes: 0, amOrPm: 'PM' as const },
      }
      const presenter = new SessionScheduleCyaPresenter(linkUrl, mixedSessionDetails)

      expect(presenter.formattedTime).toBe('11:30am to 1pm')
    })
  })

  describe('formattedDate', () => {
    it('formats date with day of week correctly', () => {
      const presenter = new SessionScheduleCyaPresenter(linkUrl, mockSessionDetails)

      expect(presenter.formattedDate).toContain('Saturday')
      expect(presenter.formattedDate).toContain('15 March 2025')
    })

    it('handles single digit dates correctly', () => {
      const singleDigitDateDetails = {
        ...mockSessionDetails,
        startDate: '1/1/2026',
      }
      const presenter = new SessionScheduleCyaPresenter(linkUrl, singleDigitDateDetails)

      expect(presenter.formattedDate).toContain('Thursday')
      expect(presenter.formattedDate).toContain('1 January 2026')
    })
  })
})
