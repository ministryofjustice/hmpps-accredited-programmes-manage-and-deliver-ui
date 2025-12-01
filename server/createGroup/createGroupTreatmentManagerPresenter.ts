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

  get utils() {
    return new PresenterUtils(this.userInputData)
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

  generateSelectedUsers(): { treatmentManager: CreateGroupTeamMember; facilitators: CreateGroupTeamMember[] } {
    if (this.userInputData) {
      const { _csrf, ...formValues } = this.userInputData

      return {
        treatmentManager: this.userInputData['create-group-treatment-manager']
          ? JSON.parse(this.userInputData['create-group-treatment-manager'] as string)
          : null,
        facilitators: Object.values(formValues)
          .filter(userAsJsonString => userAsJsonString !== '')
          .map(userAsJsonString => JSON.parse(userAsJsonString as string))
          .filter(user => user.teamMemberType === 'REGULAR_FACILITATOR'),
      }
    }
    if (this.createGroupFormData && this.createGroupFormData.teamMembers) {
      const parsedMembers = Object.values(this.createGroupFormData.teamMembers as unknown as string)
        .filter(userAsJsonString => userAsJsonString !== '')
        .map(userAsJsonString => JSON.parse(userAsJsonString as string))
      return {
        treatmentManager: parsedMembers.find(member => member.teamMemberType === 'TREATMENT_MANAGER'),
        facilitators: parsedMembers.filter(member => member.teamMemberType === 'REGULAR_FACILITATOR'),
      }
    }
    return { treatmentManager: null, facilitators: [] }
  }

  get fields() {
    const members = this.generateSelectedUsers()
    console.log('members', members)
    return {
      createGroupTreatmentManager: {
        value: members.treatmentManager ? members.treatmentManager.facilitatorCode : '',
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-treatment-manager'),
      },
      createGroupFacilitator: {
        // value: this.utils.stringValue(this.createGroupFormData.pduCode, 'pduCode'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-facilitator'),
      },
    }
  }
}
