import { CreateGroupRequest, CreateGroupTeamMember, UserTeamMember } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'
import { SelectArgsItem } from '../utils/govukFrontendTypes'

export default class CreateGroupTreatmentManagerPresenter {
  constructor(
    readonly members: UserTeamMember[] = [],
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get backLinkUri() {
    return `/group/create-a-group/location`
  }

  get text() {
    return {
      headingHintText: `Create group ${this.createGroupFormData.groupCode}`,
      headingText: `Who is responsible for the group ?`,
    }
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
