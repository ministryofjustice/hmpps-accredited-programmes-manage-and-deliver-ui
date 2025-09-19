import { Request } from 'express'
import { CohortEnum } from '@manage-and-deliver-api'
import { FormData } from '../utils/forms/formData'

export type UpdateCohortFormData = {
  referralId: string
  updatedCohort: CohortEnum
}

export default class ChangeCohortForm {
  constructor(
    private readonly request: Request,
    private readonly referralId: string,
  ) {}

  async data(): Promise<FormData<UpdateCohortFormData>> {
    return {
      paramsForUpdate: {
        referralId: this.referralId,
        updatedCohort: this.request.body.updatedCohort,
      },
      error: null,
    }
  }
}
