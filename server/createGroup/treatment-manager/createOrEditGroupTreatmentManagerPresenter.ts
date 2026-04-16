import { CreateGroupRequest, CreateGroupTeamMember, UserTeamMember } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { SelectArgsItem } from '../../utils/govukFrontendTypes'

export default class CreateOrEditGroupTreatmentManagerPresenter {
  constructor(
    private readonly groupId: string,
    private readonly groupCode: string,
    readonly members: UserTeamMember[] = [],
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get isEditJourney() {
    return Boolean(this.groupId)
  }

  get backLinkUri() {
    return this.isEditJourney ? `/group/${this.groupId}/group-details` : '/group/create-a-group/group-delivery-location'
  }

  get captionText() {
    return this.isEditJourney ? `Edit group ${this.groupCode}` : `Create group ${this.groupCode}`
  }

  get pageTitle() {
    return this.isEditJourney ? `Edit who is responsible for the group` : `Who is responsible for the group?`
  }

  get submitButtonText() {
    return this.isEditJourney ? `Submit` : `Continue`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  generateSelectOptions(
    memberType: CreateGroupTeamMember['teamMemberType'],
    selectedValue: string = '',
  ): SelectArgsItem[] {
    const pduItems: SelectArgsItem[] = this.members.map(member => ({
      text: member.personName,
      value: `{"facilitator":"${member.personName}", "facilitatorCode":"${member.personCode}", "teamName":"${member.teamName}", "teamCode":"${member.teamCode}", "teamMemberType":"${memberType}"}`,
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

  generateSelectedUsers(): {
    treatmentManager: CreateGroupTeamMember | undefined
    facilitators: CreateGroupTeamMember[] | []
    coverFacilitators: CreateGroupTeamMember[] | []
  } {
    let parsedMembers: CreateGroupTeamMember[]
    if (this.userInputData) {
      parsedMembers = this.getParsedMembers()
    } else {
      parsedMembers = this.createGroupFormData?.teamMembers
    }
    if (!parsedMembers) {
      return {
        treatmentManager: undefined,
        facilitators: [],
        coverFacilitators: [],
      }
    }
    return {
      treatmentManager: parsedMembers.find(member => member.teamMemberType === 'TREATMENT_MANAGER'),
      facilitators: parsedMembers.filter(member => member.teamMemberType === 'REGULAR_FACILITATOR'),
      coverFacilitators: parsedMembers.filter(member => member.teamMemberType === 'COVER_FACILITATOR'),
    }
  }

  private getParsedMembers(): CreateGroupTeamMember[] {
    const { _csrf, ...formValues } = this.userInputData
    const membersToParse = Object.values(formValues) as string[]

    return membersToParse
      .filter(userAsJsonString => userAsJsonString !== '')
      .map(userAsJsonString => JSON.parse(userAsJsonString))
  }

  get fields() {
    const members = this.generateSelectedUsers()
    return {
      createGroupTreatmentManager: {
        value: members.treatmentManager ? members.treatmentManager.facilitatorCode : '',
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-treatment-manager'),
      },
      createGroupFacilitator: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-facilitator'),
      },
    }
  }
}
