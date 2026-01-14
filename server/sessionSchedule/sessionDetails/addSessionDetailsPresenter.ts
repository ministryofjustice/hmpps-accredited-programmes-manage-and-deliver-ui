import {
  ScheduleSessionRequest,
  ScheduleIndividualSessionDetailsResponse,
  CreateGroupTeamMember,
} from '@manage-and-deliver-api'
import { RadiosArgsItem, SelectArgsItem } from '../../utils/govukFrontendTypes'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddSessionDetailsPresenter {
  constructor(
    readonly backLinkUrl: string,
    readonly sessionDetails: ScheduleIndividualSessionDetailsResponse,
    private readonly validationError: FormValidationError | null = null,
    private readonly createSessionDetailsFormData:
      | (Partial<ScheduleSessionRequest> & { sessionName?: string; referralName?: string })
      | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get backLinkUri() {
    return this.backLinkUrl
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get text() {
    return {
      headingText: `Add session details`,
      headingCaptionText: `Schedule a ${this.createSessionDetailsFormData.sessionName} session`,
    }
  }

  generateFacilitatorSelectOptions(selectedValue: string = ''): SelectArgsItem[] {
    const pduItems: SelectArgsItem[] = this.sessionDetails.facilitators.map(member => ({
      text: member.personName,
      value: `{"facilitator":"${member.personName}", "facilitatorCode":"${member.personCode}", "teamName":"${member.teamName}", "teamCode":"${member.teamCode}"}`,
      selected: selectedValue === member.personCode,
    }))

    const items: SelectArgsItem[] = [
      {
        text: '',
        value: '',
      },
    ]

    items.push(...pduItems)
    return items
  }

  generateSessionAttendeesRadioOptions(selectedValue: string): RadiosArgsItem[] {
    const hasSelectedValues = selectedValue && selectedValue.length > 0

    return this.sessionDetails.groupMembers.map(member => ({
      text: `${member.name} (${member.crn})`,
      value: `${member.referralId} + ${member.name}`,
      checked: hasSelectedValues ? selectedValue === member.referralId : false,
    }))
  }

  selectedAttendeeValues(): string {
    const whoValueInput = this.userInputData?.['session-details-who'] as string

    if (whoValueInput) {
      return whoValueInput.includes('+') ? whoValueInput.split('+')[0].trim() : whoValueInput
    }
    return this.createSessionDetailsFormData?.referralIds?.[0] ?? ''
  }

  generateSelectedFacilitators(): CreateGroupTeamMember[] | [] {
    let parsedMembers: CreateGroupTeamMember[] = []
    if (this.userInputData) {
      const facilitatorKeys = Object.keys(this.userInputData).filter(key =>
        key.startsWith('session-details-facilitator'),
      )
      facilitatorKeys.forEach(key => {
        const value = this.userInputData[key]
        if (value) {
          const parsedValue = JSON.parse(value as string)
          const facilitatorValue = Array.isArray(parsedValue) ? parsedValue : [parsedValue as string]
          parsedMembers.push(...facilitatorValue)
        }
      })
    } else {
      parsedMembers = this.createSessionDetailsFormData?.facilitators ?? []
    }
    if (!parsedMembers) {
      return []
    }
    return parsedMembers
  }

  get fields() {
    return {
      sessionDate: {
        value: this.utils.stringValue(this.createSessionDetailsFormData.startDate, 'session-details-date'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-details-date'),
      },
      who: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-details-who'),
      },
      sessionFacilitator: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-details-facilitator'),
      },
      startTime: this.utils.twelveHourTimeValue(
        {
          hour: this.createSessionDetailsFormData.startTime?.hour,
          minutes: this.createSessionDetailsFormData.startTime?.minutes,
          amOrPm: this.createSessionDetailsFormData.startTime?.amOrPm,
        },
        'session-details-start-time',
        this.validationError,
      ),
      endTime: this.utils.twelveHourTimeValue(
        {
          hour: this.createSessionDetailsFormData.endTime?.hour,
          minutes: this.createSessionDetailsFormData.endTime?.minutes,
          amOrPm: this.createSessionDetailsFormData.endTime?.amOrPm,
        },
        'session-details-end-time',
        this.validationError,
      ),
    }
  }
}
