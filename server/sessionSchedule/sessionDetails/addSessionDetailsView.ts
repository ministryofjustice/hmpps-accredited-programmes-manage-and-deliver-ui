import { CreateGroupTeamMember } from '@manage-and-deliver-api'
import { TimeInputArgs } from '@manage-and-deliver-ui'
import AddSessionDetailsPresenter from './addSessionDetailsPresenter'
import ViewUtils from '../../utils/viewUtils'
import { CheckboxesArgs, FieldsetArgs, SelectArgs } from '../../utils/govukFrontendTypes'

export default class AddSessionDetailsView {
  constructor(private readonly presenter: AddSessionDetailsPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private get sessionDetailsDateArgs() {
    return {
      id: 'session-details-date',
      name: 'session-details-date',

      hint: {
        text: 'Enter a date, for example, 10/7/2025, or select one from the calendar.',
      },
      label: {
        text: 'What is the date of the session?',
        classes: 'govuk-label--m',
        isPageHeading: false,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.sessionDate.errorMessage),
      value: this.presenter.fields.sessionDate.value,
    }
  }

  get startTimeInputArgs(): TimeInputArgs {
    return {
      id: 'session-details-start-time',
      namePrefix: 'session-details-start-time',
      fieldset: {
        legend: {
          text: 'When does the session start?',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      hint: {
        text: 'Use the 12-hour clock, for example 9:30am or 3:30pm. Enter 12:00pm for midday.',
      },
      errorMessages: ViewUtils.govukErrorMessages(this.presenter.fields.startTime?.errorMessages),
      items: [
        {
          classes: `govuk-input--width-2${this.presenter.fields.startTime?.hour.hasError ? ' govuk-input--error' : ''}`,
          name: 'hour',
          value: this.presenter.fields.startTime?.hour.value,
          label: 'Hour',
        },
        {
          classes: `govuk-input--width-2${this.presenter.fields.startTime?.minute.hasError ? ' govuk-input--error' : ''}`,
          name: 'minute',
          value: this.presenter.fields.startTime?.minute.value,
          label: 'Minute',
        },
      ],
      select: {
        id: 'session-details-start-time-part-of-day',
        name: 'session-details-start-time-part-of-day',
        items: ['', 'AM', 'PM'].map(value => ({
          text: value.toLowerCase(),
          value,
          selected: this.presenter.fields.startTime?.partOfDay.value === value,
        })),
        label: {
          text: 'am or pm',
        },
        classes: this.presenter.fields.startTime?.partOfDay.hasError
          ? 'govuk-select--error govuk-date-select__select'
          : 'govuk-select--time govuk-date-select__select',
      },
    }
  }

  get endTimeInputArgs(): TimeInputArgs {
    return {
      id: 'session-details-end-time',
      namePrefix: 'session-details-end-time',
      fieldset: {
        legend: {
          text: 'When does the session end?',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      hint: {
        text: 'Use the 12-hour clock, for example 9:30am or 3:30pm. Enter 12:00pm for midday.',
      },
      errorMessages: ViewUtils.govukErrorMessages(this.presenter.fields.endTime?.errorMessages),
      items: [
        {
          classes: `govuk-input--width-2${this.presenter.fields.endTime?.hour.hasError ? ' govuk-input--error' : ''}`,
          name: 'hour',
          value: this.presenter.fields.endTime?.hour.value,
          label: 'Hour',
        },
        {
          classes: `govuk-input--width-2${this.presenter.fields.endTime?.minute.hasError ? ' govuk-input--error' : ''}`,
          name: 'minute',
          value: this.presenter.fields.endTime?.minute.value,
          label: 'Minute',
        },
      ],
      select: {
        id: 'session-details-end-time-part-of-day',
        name: 'session-details-end-time-part-of-day',
        items: ['', 'AM', 'PM'].map(value => ({
          text: value.toLowerCase(),
          value,
          selected: this.presenter.fields.endTime?.partOfDay.value === value,
        })),
        label: {
          text: 'am or pm',
        },
        classes: this.presenter.fields.endTime?.partOfDay.hasError
          ? 'govuk-select--error govuk-date-select__select'
          : 'govuk-select--time govuk-date-select__select',
      },
    }
  }

  private sessionFacilitatorArgs(): SelectArgs {
    return {
      id: 'session-details-facilitator',
      name: 'session-details-facilitator',
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.sessionFacilitator.errorMessage),
      items: this.presenter.generateFacilitatorSelectOptions(),
    }
  }

  private sessionExistingFacilitatorArgs(facilitator: CreateGroupTeamMember, index: number): SelectArgs {
    return {
      id: `session-details-facilitator-existing-${index}`,
      name: `session-details-facilitator-existing-${index}`,
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.sessionFacilitator.errorMessage),
      items: this.presenter.generateFacilitatorSelectOptions(facilitator.facilitatorCode),
    }
  }

  private sessionFacilitatorsFieldSetArgs(): FieldsetArgs {
    return {
      classes: 'moj-add-another__item moj-add-another__item__facilitator',
      legend: {
        text: 'Facilitator',
        classes: 'govuk-!-display-none',
        isPageHeading: false,
      },
    }
  }

  private get sessionDetailsCheckboxArgs(): CheckboxesArgs {
    return {
      name: 'session-details-who',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'Who is this session for?',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      hint: {
        text: 'Select everyone who should attend this session.',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.who.errorMessage),
      items: this.presenter.generateSessionAttendeesCheckboxOptions(this.presenter.selectedAttendeeValues()),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionSchedule/addSessionDetails',
      {
        backLinkArgs: this.backLinkArgs(),
        text: this.presenter.text,
        sessionDetailsDateArgs: this.sessionDetailsDateArgs,
        sessionDetailsCheckboxArgs: this.sessionDetailsCheckboxArgs,
        startTimeInputArgs: this.startTimeInputArgs,
        endTimeInputArgs: this.endTimeInputArgs,
        sessionFacilitatorArgs: this.sessionFacilitatorArgs(),
        sessionFacilitatorsFieldSetArgs: this.sessionFacilitatorsFieldSetArgs(),
        sessionExistingFacilitatorArgs: this.sessionExistingFacilitatorArgs.bind(this),
        facilitators: this.presenter.generateSelectedFacilitators(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
