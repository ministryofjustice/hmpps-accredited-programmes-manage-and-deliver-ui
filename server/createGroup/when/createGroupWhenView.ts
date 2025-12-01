import ViewUtils from '../../utils/viewUtils'
import CreateGroupWhenPresenter from './createGroupWhenPresenter'
import { DAY_CONFIG, DayKey } from './daysOfWeek'

export default class CreateGroupWhenView {
  constructor(private readonly presenter: CreateGroupWhenPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
    }
  }

  private formatList(items: string[]): string {
    if (items.length === 0) return ''

    const normalised = items.map((item, index) => (index === 0 ? item : item.charAt(0).toLowerCase() + item.slice(1)))

    if (normalised.length === 1) return `${normalised[0]}.`
    if (normalised.length === 2) return `${normalised[0]} and ${normalised[1]}.`

    const allButLast = normalised.slice(0, -1).join(', ')
    const last = normalised[normalised.length - 1]
    return `${allButLast} and ${last}.`
  }

  private checkboxArgs() {
    const selectedDays: DayKey[] = (this.presenter.selectedDays || []) as DayKey[]
    const { dayTimes } = this.presenter
    const fieldsByDay = this.presenter.dayFieldErrors
    const groupErrorMessage = this.presenter.fields.createGroupWhen.errorMessage

    return {
      name: 'days-of-week',
      fieldset: {
        legend: {
          text: 'When will the group run?',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: {
        html: `
        <p>Select when group sessions will run. You can add extra information later, for example about times of individual sessions.</p>
        <p>Sessions that fall on bank holidays will automatically be moved to the next scheduled date.</p>
      `,
      },
      errorMessage: groupErrorMessage ? { text: groupErrorMessage } : undefined,
      items: DAY_CONFIG.map(day => {
        const timesForDay = dayTimes[day.key] || {}
        const hour = timesForDay.hour ?? ''
        const minutes = timesForDay.minutes ?? ''
        const amOrPm = timesForDay.amOrPm ?? ''
        const { idBase } = day

        // 🔴 per-day error from presenter (e.g. only for TUESDAY)
        const dayErrorMessage = fieldsByDay[day.key]

        const hourMissing = hour === '' || hour === undefined || hour === null
        const amOrPmMissing = amOrPm === '' || amOrPm === undefined || amOrPm === null

        const hourInvalidRange =
          hour !== '' && hour != null && (Number.isNaN(Number(hour)) || Number(hour) < 1 || Number(hour) > 12)

        const minutesInvalidRange =
          minutes !== '' &&
          minutes != null &&
          (Number.isNaN(Number(minutes)) || Number(minutes) < 0 || Number(minutes) > 59)

        const hourHasError = !!dayErrorMessage && (hourMissing || hourInvalidRange)
        const amOrPmHasError = !!dayErrorMessage && amOrPmMissing
        const minutesHasError = minutesInvalidRange

        const anyError = hourHasError || amOrPmHasError || minutesHasError

        const hourFormGroupClass = hourHasError ? 'govuk-form-group' : ''
        const minutesFormGroupClass = minutesHasError ? 'govuk-form-group' : ''
        const amOrPmFormGroupClass = amOrPmHasError ? 'govuk-form-group' : ''

        const hourInputErrorClass = hourHasError ? ' govuk-input--error' : ''
        const minutesInputErrorClass = minutesHasError ? ' govuk-input--error' : ''
        const amOrPmSelectErrorClass = amOrPmHasError ? ' govuk-select--error' : ''

        const inlineErrorParts: string[] = []
        if (hourMissing && dayErrorMessage) inlineErrorParts.push('Enter an hour')
        if (amOrPmMissing && dayErrorMessage) inlineErrorParts.push('Select am or pm')
        if (minutesInvalidRange) inlineErrorParts.push('Enter minutes between 0 and 59')
        if (hourInvalidRange) inlineErrorParts.push('Enter an hour between 1 and 12')

        const inlineErrorMessage = inlineErrorParts.length > 0 ? this.formatList(inlineErrorParts) : dayErrorMessage

        // FULL CONDITIONAL HTML — including hour/minute/am-pm fields
        const conditionalHtml = `
<div class="govuk-!-margin-left-3">
  <p class="govuk-caption-l">Start time</p>
  <p class="govuk-caption-m">
    Use the 12-hour clock, for example 9:30am or 3:00pm. Enter 12:00pm for midday.
  </p>

  ${
    anyError && inlineErrorMessage
      ? `
    <p class="govuk-error-message">
      <span class="govuk-visually-hidden">Error:</span> ${inlineErrorMessage}
    </p>
  `
      : ''
  }

  <div class="govuk-date-input" id="${idBase}-time">
    <div class="govuk-date-input__item">
      <div class="${hourFormGroupClass}">
        <label class="govuk-label govuk-date-input__label" for="${idBase}-hour">
          Hour
        </label>
        <input
          class="govuk-input govuk-date-input__input govuk-input--width-2${hourInputErrorClass}"
          id="${idBase}-hour"
          name="${idBase}-hour"
          type="text"
          inputmode="numeric"
          pattern="[0-9]{1,2}"
          maxlength="2"
          value="${hour}"
        >
      </div>
    </div>

    <div class="govuk-date-input__item">
      <div class="${minutesFormGroupClass}">
        <label class="govuk-label govuk-date-input__label" for="${idBase}-minute">
          Minute
        </label>
        <input
          class="govuk-input govuk-date-input__input govuk-input--width-2${minutesInputErrorClass}"
          id="${idBase}-minute"
          name="${idBase}-minute"
          type="text"
          inputmode="numeric"
          pattern="[0-9]{1,2}"
          maxlength="2"
          value="${minutes}"
        >
      </div>
    </div>

    <div class="govuk-date-input__item">
      <div class="${amOrPmFormGroupClass}">
        <label class="govuk-label govuk-date-input__label" for="${idBase}-ampm">
          am or pm
        </label>
        <select
          class="govuk-select govuk-date-select__select${amOrPmSelectErrorClass}"
          id="${idBase}-ampm"
          name="${idBase}-ampm"
        >
          <option value=""></option>
          <option value="am" ${amOrPm === 'AM' ? 'selected' : ''}>am</option>
          <option value="pm" ${amOrPm === 'PM' ? 'selected' : ''}>pm</option>
        </select>
      </div>
    </div>
  </div>
</div>`

        return {
          id: idBase,
          name: 'days-of-week',
          value: day.key,
          text: day.label,
          checked: selectedDays.includes(day.key),
          attributes: {
            'data-aria-controls': `${idBase}-conditional`,
          },
          conditional: {
            html: conditionalHtml,
          },
        }
      }),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupWhen',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        selectedDays: this.presenter.selectedDays,
        dayTimes: this.presenter.dayTimes,
        checkboxArgs: this.checkboxArgs(),
      },
    ]
  }
}
