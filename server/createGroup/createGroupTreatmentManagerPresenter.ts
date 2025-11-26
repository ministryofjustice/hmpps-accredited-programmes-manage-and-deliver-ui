import { CreateGroupRequest, UserTeamMember } from '@manage-and-deliver-api'
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

  generateSelectOptions(): SelectArgsItem[] {
    const pduItems: SelectArgsItem[] = this.members.map(member => ({
      text: member.personName,
      value: `{"personCode":"${member.personCode}", "teamCode":"${member.teamCode}"}`,
      // selected: this.fields.createGroupPdu.value === location.code,
    }))

    const items: SelectArgsItem[] = [
      {
        text: '',
      },
    ]

    items.push(...pduItems)
    return items
  }

  get fields() {
    return {
      createGroupTreatmentManager: {
        // value: this.utils.stringValue(this.createGroupFormData.pduCode, 'pduCode'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-treatment-manager'),
      },
    }
  }
}
