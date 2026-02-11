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
    const membersToParse = Object.values(formValues) as string[]

    return membersToParse
      .filter(userAsJsonString => userAsJsonString !== '')
      .map(userAsJsonString => JSON.parse(userAsJsonString))
  }

  get fields() {
    return {
      editSessionFacilitator: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'edit-session-facilitator'),
      },
    }
  }
}
