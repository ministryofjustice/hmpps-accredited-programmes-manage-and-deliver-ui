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

      expect(presenter.getServiceNavigationArgs()).toBeDefined()
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

    it('displays start date text with non-standard label like pre-group one-to-ones', () => {
      const dataWithPreGroupText = {
        ...mockGroupSessionsData,
        modules: [
          {
            ...mockGroupSessionsData.modules![0],
            startDateText: {
              estimatedStartDateText: 'Estimated start date of pre-group one-to-ones',
              sessionStartDate: '10 March 2025',
            },
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithPreGroupText)
      const accordionItems = presenter.getAccordionItems()
      const content = accordionItems[0].content.html

      expect(content).toContain('<strong>Estimated start date of pre-group one-to-ones:</strong> 10 March 2025')
    })

    it('handles various non-standard estimatedStartDateText labels', () => {
      const testCases = [
        {
          label: 'Expected to commence',
          date: '5 April 2025',
        },
        {
          label: 'Start date for individual sessions',
          date: '12 April 2025',
        },
        {
          label: 'Estimated start date of pre-group one-to-ones',
          date: '20 April 2025',
        },
        {
          label: 'Target start',
          date: '1 May 2025',
        },
      ]

      testCases.forEach(testCase => {
        const dataWithCustomLabel = {
          ...mockGroupSessionsData,
          modules: [
            {
              ...mockGroupSessionsData.modules![0],
              startDateText: {
                estimatedStartDateText: testCase.label,
                sessionStartDate: testCase.date,
              },
            },
          ],
        }
        const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithCustomLabel)
        const accordionItems = presenter.getAccordionItems()
        const content = accordionItems[0].content.html

        expect(content).toContain(`<strong>${testCase.label}:</strong> ${testCase.date}`)
      })
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

    it('handles button text ending with "review" instead of "session"', () => {
      const dataWithReviewButton = {
        ...mockGroupSessionsData,
        modules: [
          {
            ...mockGroupSessionsData.modules![0],
            scheduleButtonText: 'Schedule post-programme review',
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithReviewButton)
      const accordionItems = presenter.getAccordionItems()
      const content = accordionItems[0].content.html

      expect(content).toContain('Schedule post-programme review')
      expect(content).toContain(`href="/group/${groupId}/module/module-1/schedule-session-type"`)
    })

    it('handles various non-standard button text endings', () => {
      const buttonTextVariations = [
        'Schedule Module 1 session',
        'Schedule post-programme review',
        'Add one-to-one session',
        'Schedule individual session',
      ]

      buttonTextVariations.forEach(buttonText => {
        const dataWithCustomButtonText = {
          ...mockGroupSessionsData,
          modules: [
            {
              ...mockGroupSessionsData.modules![0],
              scheduleButtonText: buttonText,
            },
          ],
        }
        const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithCustomButtonText)
        const accordionItems = presenter.getAccordionItems()
        const content = accordionItems[0].content.html

        expect(content).toContain(buttonText)
        expect(content).toContain('govuk-button--secondary')
        expect(content).toContain(`href="/group/${groupId}/module/module-1/schedule-session-type"`)
      })
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

  describe('scheduleSessionSuccessMessageArgs', () => {
    it('returns success message when provided by BFF', () => {
      const presenter = new SessionScheduleAttendancePresenter(
        groupId,
        mockGroupSessionsData,
        'Getting started one-to-one for Jane Smith has been added.',
      )

      const messageArgs = presenter.scheduleSessionSuccessMessageArgs

      expect(messageArgs).toEqual({
        variant: 'success',
        title: 'Success',
        text: 'Getting started one-to-one for Jane Smith has been added.',
        dismissible: true,
      })
    })

    it('returns success message for group sessions', () => {
      const presenter = new SessionScheduleAttendancePresenter(
        groupId,
        mockGroupSessionsData,
        'Managing emotions has been added.',
      )

      const messageArgs = presenter.scheduleSessionSuccessMessageArgs

      expect(messageArgs).toEqual({
        variant: 'success',
        title: 'Success',
        text: 'Managing emotions has been added.',
        dismissible: true,
      })
    })

    it('returns null when no success message is provided', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)

      const messageArgs = presenter.scheduleSessionSuccessMessageArgs

      expect(messageArgs).toBeNull()
    })

    it('handles empty string success message', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData, '')

      const messageArgs = presenter.scheduleSessionSuccessMessageArgs

      expect(messageArgs).toBeNull()
    })
  })

  describe('non-standard names and text', () => {
    it('renders session name exactly as provided', () => {
      const dataWithNonStandardNames = {
        ...mockGroupSessionsData,
        modules: [
          {
            ...mockGroupSessionsData.modules![0],
            sessions: [
              {
                ...mockGroupSessionsData.modules![0].sessions![0],
                name: 'Session with CAPS and Numbers 123',
              },
            ],
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithNonStandardNames)
      const accordionItems = presenter.getAccordionItems()
      const content = accordionItems[0].content.html

      expect(content).toContain('Session with CAPS and Numbers 123')
    })

    it('renders module name exactly as provided', () => {
      const dataWithNonStandardModuleName = {
        ...mockGroupSessionsData,
        modules: [
          {
            ...mockGroupSessionsData.modules![0],
            name: 'MODULE_001: Special-Format Name',
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithNonStandardModuleName)
      const accordionItems = presenter.getAccordionItems()

      expect(accordionItems[0].heading.text).toBe('MODULE_001: Special-Format Name')
    })

    it('preserves special characters in names', () => {
      const dataWithSpecialCharacters = {
        ...mockGroupSessionsData,
        modules: [
          {
            ...mockGroupSessionsData.modules![0],
            sessions: [
              {
                ...mockGroupSessionsData.modules![0].sessions![0],
                name: 'Session & Assessment (Part 1)',
              },
            ],
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithSpecialCharacters)
      const accordionItems = presenter.getAccordionItems()
      const content = accordionItems[0].content.html

      expect(content).toContain('Session & Assessment (Part 1)')
    })

    it('handles whitespace-only module names gracefully', () => {
      const dataWithWhitespaceOnly = {
        ...mockGroupSessionsData,
        modules: [
          {
            ...mockGroupSessionsData.modules![0],
            name: '   ',
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithWhitespaceOnly)
      const accordionItems = presenter.getAccordionItems()

      expect(accordionItems[0].heading.text).toBe('')
    })

    it('renders undefined/missing session fields as empty strings', () => {
      const dataWithMissingFields = {
        ...mockGroupSessionsData,
        modules: [
          {
            ...mockGroupSessionsData.modules![0],
            sessions: [
              {
                id: 'session-x',
                name: undefined,
                type: undefined,
                participants: undefined,
                dateOfSession: undefined,
                timeOfSession: undefined,
                facilitators: undefined,
              },
            ],
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithMissingFields)
      const accordionItems = presenter.getAccordionItems()
      const content = accordionItems[0].content.html

      expect(content).not.toContain('undefined')
      expect(content).toContain('<tr class="govuk-table__row">')
    })

    it('handles mixed case and special formatting in table headers', () => {
      const presenter = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)
      const accordionItems = presenter.getAccordionItems()
      const content = accordionItems[0].content.html

      expect(content).toContain('Session name')
      expect(content).toContain('Session type')
      expect(content).toContain('Participants')
      expect(content).toContain('Date of session')
      expect(content).toContain('Time')
      expect(content).toContain('Facilitators')
    })

    it('renders all actual programme module headings correctly', () => {
      const actualModuleNames = [
        'Pre-group one-to-ones',
        'Getting started',
        'Managing myself',
        "Managing life's problems",
        'Managing people around me',
        'Bringing it all together',
        'Post-programme reviews',
      ]

      const dataWithActualModules = {
        ...mockGroupSessionsData,
        modules: actualModuleNames.map((name, index) => {
          const module: NonNullable<SessionScheduleGroupResponse['modules']>[number] = {
            id: `module-${index}`,
            name,
            scheduleButtonText: `Schedule ${name}`,
            startDateText: {
              estimatedStartDateText: 'Estimated start date',
              sessionStartDate: '15 March 2025',
            },
            sessions: [],
          }
          return module
        }),
      }

      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithActualModules)
      const accordionItems = presenter.getAccordionItems()

      // Rigid check: fail if modules are added, removed, or reordered
      const extractedHeadings = accordionItems.map(item => item.heading.text)
      expect(extractedHeadings).toEqual(actualModuleNames)
    })
  })

  describe('new modules detection', () => {
    it('detects when a new module is added to existing modules', () => {
      const initialData = mockGroupSessionsData
      const presenter1 = new SessionScheduleAttendancePresenter(groupId, initialData)
      const initialCount = presenter1.getAccordionItems().length

      const dataWithNewModule = {
        ...initialData,
        modules: [
          ...initialData.modules!,
          {
            id: 'module-3',
            name: 'Module 3: New Content',
            scheduleButtonText: 'Schedule Module 3 session',
            startDateText: {
              estimatedStartDateText: 'Expected to start',
              sessionStartDate: '15 May 2025',
            },
            sessions: [],
          },
        ],
      }
      const presenter2 = new SessionScheduleAttendancePresenter(groupId, dataWithNewModule)
      const newCount = presenter2.getAccordionItems().length

      expect(newCount).toBe(initialCount + 1)
      expect(newCount).toBe(3)
    })

    it('detects new module with sessions', () => {
      const dataWithNewModuleAndSessions = {
        ...mockGroupSessionsData,
        modules: [
          ...mockGroupSessionsData.modules!,
          {
            id: 'module-4',
            name: 'Module 4: Advanced Skills',
            scheduleButtonText: 'Schedule Module 4 session',
            startDateText: {
              estimatedStartDateText: 'Estimated to start',
              sessionStartDate: '1 June 2025',
            },
            sessions: [
              {
                id: 'session-4',
                name: 'Session 1: Advanced Techniques',
                type: 'Workshop',
                participants: ['John Doe', 'Jane Smith', 'Bob Brown'],
                dateOfSession: '1 June 2025',
                timeOfSession: '10:00am to 12:00pm',
                facilitators: ['Facilitator 3'],
              },
            ],
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithNewModuleAndSessions)
      const accordionItems = presenter.getAccordionItems()

      expect(accordionItems).toHaveLength(3)
      expect(accordionItems[2].heading.text).toBe('Module 4: Advanced Skills')
      expect(accordionItems[2].content.html).toContain('Session 1: Advanced Techniques')
      expect(accordionItems[2].content.html).toContain('Workshop')
    })

    it('includes new module in correct order', () => {
      const dataWithNewModuleAtStart = {
        ...mockGroupSessionsData,
        modules: [
          {
            id: 'module-0',
            name: 'Module 0: Foundations',
            scheduleButtonText: 'Schedule Module 0 session',
            startDateText: {
              estimatedStartDateText: 'Starting',
              sessionStartDate: '1 March 2025',
            },
            sessions: [],
          },
          ...mockGroupSessionsData.modules!,
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithNewModuleAtStart)
      const accordionItems = presenter.getAccordionItems()

      expect(accordionItems).toHaveLength(3)
      expect(accordionItems[0].heading.text).toBe('Module 0: Foundations')
      expect(accordionItems[1].heading.text).toBe('Module 1: Getting Started')
      expect(accordionItems[2].heading.text).toBe('Module 2: Skills Development')
    })

    it('renders all sessions in new module', () => {
      const dataWithMultiSessionNewModule = {
        ...mockGroupSessionsData,
        modules: [
          ...mockGroupSessionsData.modules!,
          {
            id: 'module-5',
            name: 'Module 5: Assessment',
            scheduleButtonText: 'Schedule Module 5 session',
            startDateText: {
              estimatedStartDateText: 'Scheduled for',
              sessionStartDate: '15 June 2025',
            },
            sessions: [
              {
                id: 'session-5a',
                name: 'Session 1: Written Assessment',
                type: 'Assessment',
                participants: ['John Doe'],
                dateOfSession: '15 June 2025',
                timeOfSession: '9:00am to 10:00am',
                facilitators: ['Invigilator 1'],
              },
              {
                id: 'session-5b',
                name: 'Session 2: Practical Assessment',
                type: 'Assessment',
                participants: ['John Doe'],
                dateOfSession: '22 June 2025',
                timeOfSession: '2:00pm to 3:30pm',
                facilitators: ['Invigilator 2'],
              },
            ],
          },
        ],
      }
      const presenter = new SessionScheduleAttendancePresenter(groupId, dataWithMultiSessionNewModule)
      const accordionItems = presenter.getAccordionItems()
      const newModuleContent = accordionItems[2].content.html

      expect(newModuleContent).toContain('Session 1: Written Assessment')
      expect(newModuleContent).toContain('Session 2: Practical Assessment')
      expect(newModuleContent).toContain('15 June 2025')
      expect(newModuleContent).toContain('22 June 2025')
    })

    it('detects removal of existing module', () => {
      const presenter1 = new SessionScheduleAttendancePresenter(groupId, mockGroupSessionsData)
      const initialCount = presenter1.getAccordionItems().length

      const dataWithRemovedModule = {
        ...mockGroupSessionsData,
        modules: [mockGroupSessionsData.modules![0]],
      }
      const presenter2 = new SessionScheduleAttendancePresenter(groupId, dataWithRemovedModule)
      const reducedCount = presenter2.getAccordionItems().length

      expect(reducedCount).toBe(initialCount - 1)
      expect(reducedCount).toBe(1)
    })
  })
})
