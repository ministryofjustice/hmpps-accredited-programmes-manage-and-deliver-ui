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
      // headingHintText: `Create group ${this.createGroupFormData?.groupCode}`,
      headingHintText: `Create group 123`,
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
    treatmentManager: CreateGroupTeamMember
    facilitators: CreateGroupTeamMember[]
    coverFacilitators: CreateGroupTeamMember[]
  } {
    const parsedMembers = this.getParsedMembers()

    return {
      treatmentManager: parsedMembers.find(member => member.teamMemberType === 'TREATMENT_MANAGER'),
      facilitators: parsedMembers.filter(member => member.teamMemberType === 'REGULAR_FACILITATOR'),
      coverFacilitators: parsedMembers.filter(member => member.teamMemberType === 'COVER_FACILITATOR'),
    }
  }

  private getParsedMembers(): CreateGroupTeamMember[] {
    const rawMembers = this.getRawMemberStrings()

    return rawMembers
      .filter(userAsJsonString => userAsJsonString !== '')
      .map(userAsJsonString => JSON.parse(userAsJsonString))
  }

  private getRawMemberStrings(): string[] {
    if (this.userInputData) {
      const { _csrf, ...formValues } = this.userInputData
      return Object.values(formValues) as string[]
    }

    if (this.createGroupFormData?.teamMembers) {
      // Note: The API type defines teamMembers as CreateGroupTeamMember[], but at runtime
      // it's actually Record<string, string> when populated from form data
      return Object.values(this.createGroupFormData.teamMembers as unknown as Record<string, string>)
    }

    return []
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
