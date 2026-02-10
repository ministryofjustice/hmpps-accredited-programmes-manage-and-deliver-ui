import { Session, EditSessionAttendee, GroupItem } from '@manage-and-deliver-api'
import EditSessionAttendanceWhoPresenter from './editSessionAttendanceWhoPresenter'
import { FormValidationError } from '../../utils/formValidationError'

// Extract the individual group member type from the pagination wrapper
type IndividualGroupMember = NonNullable<GroupItem['content']>[number]

describe('EditSessionAttendanceWhoPresenter', () => {
  const groupId = 'group-123'
  const backUrl = '/back-url'

  const mockSessionDetails: Session = {
    id: 'session-123',
    type: 'Individual',
    name: 'Getting started',
    number: 1,
    isCatchup: false,
    referrals: [
      {
        id: 'referral-1',
        personName: 'John Doe',
        crn: 'X123456',
        createdAt: '2024-01-01',
        status: 'REFERRED',
        cohort: 'GENERAL_OFFENCE',
      },
      {
        id: 'referral-2',
        personName: 'Jane Smith',
        crn: 'Y654321',
        createdAt: '2024-01-02',
        status: 'REFERRED',
        cohort: 'SEXUAL_OFFENCE',
      },
    ],
  } as Session

  const mockCurrentlyAttending: EditSessionAttendee = {
    name: 'John Doe',
    referralId: 'referral-1',
    crn: 'X123456',
    currentlyAttending: true,
  }

  const mockGroupMembers: Array<IndividualGroupMember> = [
    {
      referralId: 'referral-1',
      personName: 'John Doe',
      crn: 'X123456',
      sourcedFrom: 'Licence end date',
      sentenceEndDate: '28 April 2027',
      cohort: 'GENERAL_OFFENCE',
      hasLdc: false,
      age: 36,
      sex: 'Male',
      pdu: 'London',
      reportingTeam: 'London Office 1',
      status: 'Scheduled',
      statusColour: 'purple',
      activeProgrammeGroupId: null,
    },
    {
      referralId: 'referral-2',
      personName: 'Jane Smith',
      crn: 'Y654321',
      sourcedFrom: 'Order end date',
      sentenceEndDate: '14 April 2028',
      cohort: 'SEXUAL_OFFENCE',
      hasLdc: true,
      age: 29,
      sex: 'Female',
      pdu: 'London',
      reportingTeam: 'London Office 2',
      status: 'Scheduled',
      statusColour: 'purple',
      activeProgrammeGroupId: null,
    },
  ]

  describe('text', () => {
    it('should return correct page heading and caption', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        mockSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
      )

      expect(presenter.text).toEqual({
        pageHeading: 'Getting started',
        pageHeadingType: 'one-to-one',
        pageCaption: 'John Doe',
      })
    })

    it('should return empty string for pageCaption when referrals array is empty', () => {
      const emptySessionDetails: Session = {
        ...mockSessionDetails,
        referrals: [],
      }
      const emptyAttendee: EditSessionAttendee = {
        name: '',
        referralId: '',
        crn: '',
        currentlyAttending: false,
      }
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        emptySessionDetails,
        emptyAttendee,
        mockGroupMembers,
      )

      expect(presenter.text).toEqual({
        pageHeading: 'Getting started',
        pageHeadingType: 'one-to-one',
        pageCaption: '',
      })
    })

    it('should return "one-to-one catch-up" for pageHeadingType when session is a catch-up', () => {
      const catchupSessionDetails: Session = {
        ...mockSessionDetails,
        isCatchup: true,
      }
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        catchupSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
      )

      expect(presenter.text).toEqual({
        pageHeading: 'Getting started',
        pageHeadingType: 'one-to-one catch-up',
        pageCaption: 'John Doe',
      })
    })
  })

  describe('backLinkArgs', () => {
    it('should return correct back link arguments', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        mockSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
      )

      expect(presenter.backLinkArgs).toEqual({
        text: 'Back',
        href: backUrl,
      })
    })
  })

  describe('generateAttendeeRadioOptions', () => {
    it('should generate radio options with currently attending referral pre-selected', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        mockSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
      )

      const options = presenter.generateAttendeeRadioOptions()

      expect(options).toEqual([
        {
          text: 'John Doe (X123456)',
          value: 'referral-1',
          checked: true,
        },
        {
          text: 'Jane Smith (Y654321)',
          value: 'referral-2',
          checked: false,
        },
      ])
    })

    it('should generate radio options with first referral selected from user input', () => {
      const userInputData = {
        'edit-session-attendance-who': 'referral-1',
      }
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        mockSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
        null,
        userInputData,
      )

      const options = presenter.generateAttendeeRadioOptions()

      expect(options).toEqual([
        {
          text: 'John Doe (X123456)',
          value: 'referral-1',
          checked: true,
        },
        {
          text: 'Jane Smith (Y654321)',
          value: 'referral-2',
          checked: false,
        },
      ])
    })

    it('should generate radio options with second referral selected from user input', () => {
      const userInputData = {
        'edit-session-attendance-who': 'referral-2',
      }
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        mockSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
        null,
        userInputData,
      )

      const options = presenter.generateAttendeeRadioOptions()

      expect(options).toEqual([
        {
          text: 'John Doe (X123456)',
          value: 'referral-1',
          checked: false,
        },
        {
          text: 'Jane Smith (Y654321)',
          value: 'referral-2',
          checked: true,
        },
      ])
    })

    it('should handle empty referrals array', () => {
      const emptySessionDetails: Session = {
        ...mockSessionDetails,
        referrals: [],
      }
      const emptyAttendee: EditSessionAttendee = {
        name: '',
        referralId: '',
        crn: '',
        currentlyAttending: false,
      }
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, emptySessionDetails, emptyAttendee, [])

      const options = presenter.generateAttendeeRadioOptions()

      expect(options).toEqual([])
    })
  })

  describe('errorSummary', () => {
    it('should return null when there is no validation error', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        mockSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
      )

      expect(presenter.errorSummary).toBeNull()
    })

    it('should return error summary when there is a validation error', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['edit-session-attendance-who'],
            errorSummaryLinkedField: 'edit-session-attendance-who',
            message: 'Select who should attend the session',
          },
        ],
      }
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        mockSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
        validationError,
      )

      expect(presenter.errorSummary).toEqual([
        {
          field: 'edit-session-attendance-who',
          message: 'Select who should attend the session',
        },
      ])
    })
  })

  describe('fields', () => {
    it('should return field with no error message when there is no validation error', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        mockSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
      )

      expect(presenter.fields).toEqual({
        'edit-session-attendance-who': {
          errorMessage: null,
        },
      })
    })

    it('should return field with error message when there is a validation error', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['edit-session-attendance-who'],
            errorSummaryLinkedField: 'edit-session-attendance-who',
            message: 'Select who should attend the session',
          },
        ],
      }
      const presenter = new EditSessionAttendanceWhoPresenter(
        groupId,
        backUrl,
        mockSessionDetails,
        mockCurrentlyAttending,
        mockGroupMembers,
        validationError,
      )

      expect(presenter.fields['edit-session-attendance-who'].errorMessage).toBe('Select who should attend the session')
    })
  })
})
