import { TimeInputArgs } from '@manage-and-deliver-ui'
import ViewUtils from '../../utils/viewUtils'
import EditSessionDateAndTimePresenter from './editSessionDateAndTimePresenter'

export default class EditSessionDateAndTimeView {
  constructor(private readonly presenter: EditSessionDateAndTimePresenter) {}

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
        text: 'Enter a date, for example 10/7/2025, or select one from the calendar.',
      },
      label: {
        text: 'Session date',
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
          text: 'Start time',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      hint: {
        text: 'Use the 12-hour clock, for example 9:30am or 3pm. Enter 12pm for midday.',
      },
      errorMessages: ViewUtils.govukErrorMessages(this.presenter.fields.startTime.errorMessages),
      items: [
        {
          classes: `govuk-input--width-2${this.presenter.fields.startTime.hour.hasError ? ' govuk-input--error' : ''}`,
          name: 'hour',
          value: this.presenter.fields.startTime.hour.value,
          label: 'Hour',
        },
        {
          classes: `govuk-input--width-2${this.presenter.fields.startTime.minute.hasError ? ' govuk-input--error' : ''}`,
          name: 'minute',
          value: this.presenter.fields.startTime.minute.value,
          label: 'Minute',
        },
      ],
      select: {
        id: 'session-details-start-time-part-of-day',
        name: 'session-details-start-time-part-of-day',
        items: ['', 'AM', 'PM'].map(value => ({
          text: value.toLowerCase(),
          value,
          selected: this.presenter.fields.startTime.partOfDay.value === value,
        })),
        label: {
          text: 'am or pm',
        },
        classes: this.presenter.fields.startTime.partOfDay.hasError
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
      errorMessages: ViewUtils.govukErrorMessages(this.presenter.fields.endTime.errorMessages),
      items: [
        {
          classes: `govuk-input--width-2${this.presenter.fields.endTime.hour.hasError ? ' govuk-input--error' : ''}`,
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

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'editSession/editSessionTimeAndDate',
      {
        backLinkArgs: this.backLinkArgs(),
        text: this.presenter.text,
        sessionDetailsDateArgs: this.sessionDetailsDateArgs,
        startTimeInputArgs: this.startTimeInputArgs,
        endTimeInputArgs: this.endTimeInputArgs,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        isGroupSession: this.presenter.isGroupSession,
      },
    ]
  }
}
