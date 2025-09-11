import { DeliveryLocationPreferencesFormData } from '@manage-and-deliver-api'
import { IAccreditedProgrammesManageAndDeliverService } from '../services/accreditedProgrammesManageAndDeliverService'

export class FakeAccreditedProgrammesManageAndDeliverService implements IAccreditedProgrammesManageAndDeliverService {
  private _passedArguments: Record<string, string>[] = []

  private _returningData: any = null

  public alwaysReturnData(data: any) {
    this._returningData = data
  }

  public refreshAllStubs() {
    this._passedArguments = []
    this._returningData = null
  }

  getDeliveryLocationPreferencesFormData(
    username: string,
    referralId: string,
  ): Promise<DeliveryLocationPreferencesFormData> {
    this._passedArguments.push({ username, referralId })
    return this._returningData
  }
}
