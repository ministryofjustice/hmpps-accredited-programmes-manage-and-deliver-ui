import { SessionScheduleGroupResponse } from '@manage-and-deliver-api'
import SessionScheduleAttendancePresenter from './sessionScheduleAttendancePresenter'

describe('SessionScheduleAttendancePresenter', () => {
  const groupId = 'group-123'

  const mockGroupSessionsData: SessionScheduleGroupResponse = {
    group: {
      id: groupId,
      code: 'GRP-001',
      name: 'Test Group',
    },
    modules: [
      {
        id: 'module-1',
        name: 'Module 1: Getting Started',
        scheduleButtonText: 'Schedule Module 1 session',
        startDateText: {
          estimatedStartDateText: 'Estimated start date',
          sessionStartDate: '15 March 2025',
        },
        sessions: [
          {
            id: 'session-1',
            name: 'Session 1: Introduction',
            type: 'One-to-one',
            participants: ['John Doe', 'Jane Smith'],
            dateOfSession: '15 March 2025',
            timeOfSession: '9:30am to 11:00am',
            facilitators: ['Facilitator 1', 'Facilitator 2'],
          },
          {
            id: 'session-2',
            name: 'Session 2: Progress check',
            type: 'Group',
            participants: ['John Doe'],
            dateOfSession: '22 March 2025',
            timeOfSession: '2:00pm to 3:30pm',
            facilitators: ['Facilitator 1'],
          },
        ],
      },
      {
        id: 'module-2',
        name: 'Module 2: Skills Development',
        scheduleButtonText: 'Schedule Module 2 session',
        startDateText: {
          estimatedStartDateText: 'Expected to start',
          sessionStartDate: '1 April 2025',
        },
        sessions: [],
      },
    ],
  }

  describe('text', () => {
    it('returns the correct heading caption and text', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)

      expect(presenter.text).toEqual({
        headingCaptionText: 'GRP-001',
        headingText: 'Sessions and attendance',
      })
    })

    it('returns empty caption when group code is not available', () => {
      const dataWithoutCode = {
        ...mockGroupSessionsData,
        group: { ...mockGroupSessionsData.group, code: undefined },
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithoutCode)

      expect(presenter.text.headingCaptionText).toBe('')
    })
  })

  describe('navigationPresenter', () => {
    it('creates a navigation presenter with sessions active', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)

      expect(presenter.navigationPresenter).toBeDefined()
    })
  })

  describe('getAccordionItems', () => {
    it('returns accordion items for each module with sessions', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)
      const accordionItems = presenter.getAccordionItems()

      expect(accordionItems).toHaveLength(2)
      expect(accordionItems[0].heading.text).toBe('Module 1: Getting Started')
      expect(accordionItems[1].heading.text).toBe('Module 2: Skills Development')
    })

    it('returns a message when no modules are available', () => {
      const emptyData = { ...mockGroupSessionsData, modules: [] }
      const presenter = new SessionScheduleAttendancePresenter(groupId, emptyData)
      const accordionItems = presenter.getAccordionItems()

      expect(accordionItems).toHaveLength(1)
      expect(accordionItems[0].heading.text).toBe('No modules available')
      expect(accordionItems[0].content.html).toContain('There are no module details available')
      expect(accordionItems[0].expanded).toBe(true)
    })

    it('handles null modules gracefully', () => {
      const nullModulesData = { ...mockGroupSessionsData, modules: null }
      const presenter = new SessionScheduleAttendancePresenter(groupId, nullModulesData)
      const accordionItems = presenter.getAccordionItems()

      expect(accordionItems).toHaveLength(1)
      expect(accordionItems[0].heading.text).toBe('No modules available')
    })
  })

  describe('accordion content', () => {
    it('renders a table with sessions when sessions exist', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)
      const accordionItems = presenter.getAccordionItems()
      const firstModuleContent = accordionItems[0].content.html

      expect(firstModuleContent).toContain('<table class="govuk-table" data-module="moj-sortable-table">')
      expect(firstModuleContent).toContain('Session name')
      expect(firstModuleContent).toContain('Session type')
      expect(firstModuleContent).toContain('Participants')
      expect(firstModuleContent).toContain('Date of session')
      expect(firstModuleContent).toContain('Time')
      expect(firstModuleContent).toContain('Facilitators')
    })

    it('renders session data in table rows', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)
      const accordionItems = presenter.getAccordionItems()
      const firstModuleContent = accordionItems[0].content.html

      expect(firstModuleContent).toContain('Session 1: Introduction')
      expect(firstModuleContent).toContain('One-to-one')
      expect(firstModuleContent).toContain('John Doe<br/> Jane Smith')
      expect(firstModuleContent).toContain('15 March 2025')
      expect(firstModuleContent).toContain('9:30am to 11:00am')
      expect(firstModuleContent).toContain(
        'Facilitator 1<span class="govuk-!-display-block govuk-!-margin-bottom-1"></span>Facilitator 2',
      )
    })

    it('renders facilitators with spacing using govuk utility classes', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)
      const accordionItems = presenter.getAccordionItems()
      const firstModuleContent = accordionItems[0].content.html

      expect(firstModuleContent).toContain(
        'Facilitator 1<span class="govuk-!-display-block govuk-!-margin-bottom-1"></span>Facilitator 2',
      )
    })

    it('displays estimated start date text when available', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)
      const accordionItems = presenter.getAccordionItems()
      const firstModuleContent = accordionItems[0].content.html

      expect(firstModuleContent).toContain('<strong>Estimated start date:</strong> 15 March 2025')
    })

    it('does not display start date text when not available', () => {
      const dataWithoutStartDate = {
        ...mockGroupSessionsData,
        modules: [
          {
            ...mockGroupSessionsData.modules![0],
            startDateText: undefined,
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithoutStartDate)
      const accordionItems = presenter.getAccordionItems()
      const content = accordionItems[0].content.html

      expect(content).not.toContain('<strong>')
      expect(content).not.toContain('Estimated start date')
    })

    it('renders schedule button with correct href', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)
      const accordionItems = presenter.getAccordionItems()
      const firstModuleContent = accordionItems[0].content.html

      expect(firstModuleContent).toContain('Schedule Module 1 session')
      expect(firstModuleContent).toContain(`href="/group/${groupId}/module/module-1/schedule-session-type"`)
      expect(firstModuleContent).toContain('govuk-button--secondary')
    })

    it('uses default button text when not provided', () => {
      const dataWithoutButtonText = {
        ...mockGroupSessionsData,
        modules: [
          {
            ...mockGroupSessionsData.modules![0],
            scheduleButtonText: undefined,
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithoutButtonText)
      const accordionItems = presenter.getAccordionItems()
      const content = accordionItems[0].content.html

      expect(content).toContain('Schedule a session')
    })

    it('handles sessions with empty arrays gracefully', () => {
      const moduleWithEmptyFields = {
        ...mockGroupSessionsData,
        modules: [
          {
            id: 'module-3',
            name: 'Module 3',
            sessions: [
              {
                id: 'session-3',
                name: 'Session 3',
                type: 'Group',
                participants: [],
                dateOfSession: '1 April 2025',
                timeOfSession: '10:00am to 11:30am',
                facilitators: [],
              },
            ],
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, moduleWithEmptyFields)
      const accordionItems = presenter.getAccordionItems()
      const content = accordionItems[0].content.html

      expect(content).toContain('Session 3')
      expect(content).not.toContain('undefined')
    })
  })
})
