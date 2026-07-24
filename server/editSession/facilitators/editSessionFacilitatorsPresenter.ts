import { EditSessionFacilitatorsRequest, EditSessionFacilitatorsResponse } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import { SelectArgsItem } from '../../utils/govukFrontendTypes'
import PresenterUtils from '../../utils/presenterUtils'

export default class EditSessionFacilitatorsPresenter {
  constructor(
    readonly linkUrl: string,
    readonly groupId: string,
    private readonly editSessionFacilitatorsResponse: EditSessionFacilitatorsResponse,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.linkUrl,
    }
  }

  get pageTitles(): string {
    return 'Edit the session facilitators'
  }

  get text() {
    return {
      pageHeading: `Edit the session facilitators`,
      pageCaption: this.editSessionFacilitatorsResponse.pageTitle,
    }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  generateSelectOptions(selectedValue: string = ''): SelectArgsItem[] {
    const facilitatorItems: SelectArgsItem[] = this.editSessionFacilitatorsResponse.facilitators.map(facilitator => ({
      text: facilitator.facilitatorName,
      value: `{"facilitatorName":"${facilitator.facilitatorName}", "facilitatorCode":"${facilitator.facilitatorCode}", "teamName":"${facilitator.teamName}", "teamCode":"${facilitator.teamCode}"}`,
      selected: selectedValue === facilitator.facilitatorCode,
    }))

    const items: SelectArgsItem[] = [
      {
        text: '',
        value: '',
      },
    ]

    items.push(...facilitatorItems)
    return items
  }

  generateSelectedUsers(): {
    facilitators: EditSessionFacilitatorsRequest[] | []
  } {
    let parsedMembers: EditSessionFacilitatorsRequest[]
    if (this.userInputData) {
      parsedMembers = this.getParsedMembers()
    } else {
      parsedMembers = this.editSessionFacilitatorsResponse.facilitators.filter(
        facilitator => facilitator.currentlyFacilitating,
      )
    }
    if (!parsedMembers) {
      return {
        facilitators: [],
      }
    }
    return {
      facilitators: parsedMembers,
    }
  }

  private getParsedMembers(): EditSessionFacilitatorsRequest[] {
    const { _csrf, ...formValues } = this.userInputData

    return Object.entries(formValues)
      .filter(([key]) => key.startsWith('edit-session-facilitator'))
      .map(([, value]) => value as string)
      .filter(userAsJsonString => userAsJsonString !== '')
      .map(userAsJsonString => JSON.parse(userAsJsonString))
  }

  errorMessageForField(field: string): string | null {
    return PresenterUtils.errorMessage(this.validationError, field)
  }
}
