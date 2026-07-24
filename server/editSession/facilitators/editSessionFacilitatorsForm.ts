import { EditSessionFacilitatorsRequest } from '@manage-and-deliver-api'
import { Request } from 'express'
import { ValidationChain, body } from 'express-validator'
import errorMessages from '../../utils/errorMessages'
import { FormData } from '../../utils/forms/formData'
import { FormValidationError } from '../../utils/formValidationError'
import FormUtils from '../../utils/formUtils'

export default class EditSessionFacilitatorsForm {
  constructor(private readonly request: Request) {}

  async editSessionFacilitatorsData(): Promise<FormData<Partial<EditSessionFacilitatorsRequest[]>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.editSessionFacilitatorsValidations(),
    })

    const validationError = FormUtils.validationErrorFromResult(validationResult)
    const duplicateFacilitatorErrors = this.createDuplicateFacilitatorErrors()

    if (validationError || duplicateFacilitatorErrors.length > 0) {
      return {
        paramsForUpdate: null,
        error: {
          errors: [...(validationError?.errors || []), ...duplicateFacilitatorErrors],
        },
      }
    }
    const { _csrf, ...formValues } = this.request.body
    const facilitators = Object.entries(formValues)
      .filter(([key, value]) => key.startsWith('edit-session-facilitator') && value !== '')
      .map(([, value]) => JSON.parse(value as string)) as EditSessionFacilitatorsRequest[]
    return {
      paramsForUpdate: facilitators,
      error: null,
    }
  }

  private editSessionFacilitatorsValidations(): ValidationChain[] {
    const hasFacilitator = Object.entries(this.request.body).some(
      ([key, value]) => key.startsWith('edit-session-facilitator') && value !== '',
    )
    return [
      body('edit-session-facilitator-0')
        .custom(() => hasFacilitator)
        .withMessage(errorMessages.editSession.editSessionFacilitatorEmpty),
    ]
  }

  private createDuplicateFacilitatorErrors(): FormValidationError['errors'] {
    const selections = this.getFacilitatorSelections()
    const fieldNamesByCode = new Map<string, string[]>()

    selections.forEach(({ fieldName, facilitatorCode }) => {
      const existing = fieldNamesByCode.get(facilitatorCode) || []
      existing.push(fieldName)
      fieldNamesByCode.set(facilitatorCode, existing)
    })

    const duplicateFieldNames = new Set<string>()
    fieldNamesByCode.forEach(fieldNames => {
      if (fieldNames.length > 1) {
        fieldNames.forEach(fieldName => duplicateFieldNames.add(fieldName))
      }
    })

    if (duplicateFieldNames.size === 0) {
      return []
    }

    const orderedFieldNames = selections
      .map(selection => selection.fieldName)
      .filter((fieldName, index, allFieldNames) => {
        return duplicateFieldNames.has(fieldName) && allFieldNames.indexOf(fieldName) === index
      })

    return orderedFieldNames.map(fieldName => ({
      formFields: [fieldName],
      errorSummaryLinkedField: fieldName,
      message: errorMessages.editSession.editSessionFacilitatorDuplicate,
    }))
  }

  private getFacilitatorSelections(): Array<{ fieldName: string; facilitatorCode: string }> {
    return Object.entries(this.request.body)
      .filter(([key, value]) => key.startsWith('edit-session-facilitator') && value)
      .map(([key, value]) => ({
        fieldName: key,
        facilitatorCode: this.parseFacilitatorCode(value),
      }))
      .filter((selection): selection is { fieldName: string; facilitatorCode: string } =>
        Boolean(selection.facilitatorCode),
      )
  }

  private parseFacilitatorCode(value: unknown): string {
    if (typeof value !== 'string') {
      return ''
    }
    try {
      return JSON.parse(value)?.facilitatorCode || ''
    } catch {
      return ''
    }
  }
}
