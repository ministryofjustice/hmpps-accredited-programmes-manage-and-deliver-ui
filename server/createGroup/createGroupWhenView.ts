import ViewUtils from '../utils/viewUtils'
import CreateGroupWhenPresenter from './createGroupWhenPresenter'

type DayKey = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

type DayConfig = {
  key: DayKey
  idBase: string
  label: string
}

const DAY_CONFIG: DayConfig[] = [
  { key: 'MONDAY', idBase: 'monday', label: 'Mondays' },
  { key: 'TUESDAY', idBase: 'tuesday', label: 'Tuesdays' },
  { key: 'WEDNESDAY', idBase: 'wednesday', label: 'Wednesdays' },
  { key: 'THURSDAY', idBase: 'thursday', label: 'Thursdays' },
  { key: 'FRIDAY', idBase: 'friday', label: 'Fridays' },
  { key: 'SATURDAY', idBase: 'saturday', label: 'Saturdays' },
  { key: 'SUNDAY', idBase: 'sunday', label: 'Sundays' },
]

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

  private checkboxArgs() {
    const selectedDays: DayKey[] = (this.presenter.selectedDays || []) as DayKey[]
    const dayTimes = this.presenter.dayTimes || {}
    const fieldsByDay = this.presenter.dayFieldErrors || {}

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

      items: DAY_CONFIG.map(day => {
        const timesForDay = dayTimes[day.key] || {}
        const hour = timesForDay.hour ?? ''
        const minutes = timesForDay.minutes ?? ''
        const amOrPm = timesForDay.amOrPm ?? ''
        const { idBase } = day

        // 🔴 per-day error from presenter (e.g. only for TUESDAY)
        const dayErrorMessage = fieldsByDay[day.key]

        const errorHtml = dayErrorMessage
          ? `
<p class="govuk-error-message">
  <span class="govuk-visually-hidden">Error:</span> ${dayErrorMessage}
</p>`
          : ''

        const formGroupClass = dayErrorMessage ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'

        const conditionalHtml = `
<div class="govuk-!-margin-left-3">
  <p class="govuk-caption-l">Start time</p>
  <p class="govuk-caption-m">
    Use the 12-hour clock, for example 9:30am or 3:00pm. Enter 12:00pm for midday.
  </p>

  ${errorHtml}

  <div class="govuk-date-input" id="${idBase}-time">
    <div class="govuk-date-input__item">
      <div class="${formGroupClass}">
        <label class="govuk-label govuk-date-input__label" for="${idBase}-hour">
          Hour
        </label>
        <input
          class="govuk-input govuk-date-input__input govuk-input--width-2"
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
      <div class="${formGroupClass}">
        <label class="govuk-label govuk-date-input__label" for="${idBase}-minute">
          Minute
        </label>
        <input
          class="govuk-input govuk-date-input__input govuk-input--width-2"
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
      <div class="${formGroupClass}">
        <label class="govuk-label govuk-date-input__label" for="${idBase}-ampm">
          am or pm
        </label>
        <select
          class="govuk-select govuk-date-select__select"
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

      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupWhen?.errorMessage),
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
