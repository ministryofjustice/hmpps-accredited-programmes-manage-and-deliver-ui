import { CreateGroupRequest, CreateGroupTeamMember } from '@manage-and-deliver-api'
import { Request } from 'express'
import { body, ValidationChain } from 'express-validator'
import errorMessages from '../utils/errorMessages'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'
import { DAY_CONFIG, DayKey } from './when/daysOfWeek'

export default class CreateGroupForm {
  constructor(
    private readonly request: Request,
    private readonly existingGroupCode?: string,
  ) {}

  async createGroupCodeData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupCodeValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    return {
      paramsForUpdate: {
        groupCode: this.request.body['create-group-code'],
      },
      error: null,
    }
  }

  async createGroupCohortData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupCohortValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    return {
      paramsForUpdate: {
        cohort: this.request.body['create-group-cohort'],
      },
      error: null,
    }
  }

  async createGroupDateData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupDateValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    return {
      paramsForUpdate: {
        earliestStartDate: this.request.body['create-group-date'],
      },
      error: null,
    }
  }

  async createGroupWhenData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const raw = this.request.body['days-of-week']
    const selectedDays: DayKey[] = []
    if (Array.isArray(raw)) {
      selectedDays.push(...(raw as DayKey[]))
    } else if (raw) {
      selectedDays.push(raw as DayKey)
    }

    const slots = selectedDays.map(dayOfWeek => {
      const cfg = DAY_CONFIG.find(d => d.key === dayOfWeek)
      const idBase = cfg?.idBase ?? dayOfWeek.toLowerCase()

      const hourRaw = this.request.body[`${idBase}-hour`]
      const minuteRaw = this.request.body[`${idBase}-minute`]
      const ampmRaw = this.request.body[`${idBase}-ampm`]

      const hour = Number(hourRaw)
      const minutes = minuteRaw === '' || minuteRaw === undefined ? 0 : Number(minuteRaw)
      const amOrPm = (ampmRaw || '').toUpperCase() as 'AM' | 'PM'

      return {
        dayOfWeek,
        hour,
        minutes,
        amOrPm,
      }
    })

    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupWhenValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)

    if (error) {
      return {
        paramsForUpdate: null,
        error,
        temporarySlots: slots,
      } as FormData<Partial<CreateGroupRequest>> & {
        temporarySlots: Array<{
          dayOfWeek: DayKey
          hour: number
          minutes: number
          amOrPm: 'AM' | 'PM'
        }>
      }
    }

    return {
      paramsForUpdate: {
        createGroupSessionSlot: slots,
      },
      error: null,
    }
  }

  async createGroupSexData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupSexValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    return {
      paramsForUpdate: {
        sex: this.request.body['create-group-sex'],
      },
      error: null,
    }
  }

  async createGroupPduData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupPduValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    const pduInfo = JSON.parse(this.request.body['create-group-pdu'])
    return {
      paramsForUpdate: {
        pduName: pduInfo.name,
        pduCode: pduInfo.code,
      },
      error: null,
    }
  }

  async createGroupLocationData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupLocationValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    const deliveryLocationInfo = JSON.parse(this.request.body['create-group-location'])
    return {
      paramsForUpdate: {
        deliveryLocationName: deliveryLocationInfo.name,
        deliveryLocationCode: deliveryLocationInfo.code,
      },
      error: null,
    }
  }

  async createGroupTreatmentManagerData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupTreatmentManagerValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }
    const { _csrf, ...formValues } = this.request.body
    const teamMembers = Object.values(formValues)
      .filter(value => value !== '')
      .map(value => JSON.parse(value as string))

    return {
      paramsForUpdate: {
        teamMembers: teamMembers as CreateGroupTeamMember[],
      },
      error: null,
    }
  }

  private createGroupCodeValidations(): ValidationChain[] {
    const validations = [
      body('create-group-code').notEmpty().withMessage(errorMessages.createGroup.createGroupCodeEmpty),
    ]

    if (this.existingGroupCode) {
      validations.push(
        body('create-group-code')
          .not()
          .equals(this.existingGroupCode)
          .withMessage(errorMessages.createGroup.createGroupCodeExists(this.existingGroupCode)),
      )
    }

    return validations
  }

  private createGroupCohortValidations(): ValidationChain[] {
    return [body('create-group-cohort').notEmpty().withMessage(errorMessages.createGroup.createGroupCohortSelect)]
  }

  private createGroupDateValidations(): ValidationChain[] {
    return [
      body('create-group-date')
        .notEmpty()
        .withMessage(errorMessages.createGroup.createGroupDateSelect)
        .bail()
        .matches(/^([1-9]|[12]\d|3[01])\/([1-9]|1[0-2])\/\d{4}$/)
        .withMessage(errorMessages.createGroup.createGroupDateInvalid)
        .bail()
        .custom((value: string) => {
          const [day, month, year] = value.split('/').map(Number)
          const inputDate = new Date(year, month - 1, day)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (inputDate < today) {
            throw new Error(errorMessages.createGroup.createGroupDateInPast)
          }

          return true
        }),
    ]
  }

  private createGroupSexValidations(): ValidationChain[] {
    return [body('create-group-sex').notEmpty().withMessage(errorMessages.createGroup.createGroupSexSelect)]
  }

  private createGroupWhenValidations(): ValidationChain[] {
    return [
      body('create-group-when').custom((_, { req }) => {
        const raw = req.body['days-of-week']

        const selected: DayKey[] = []
        if (Array.isArray(raw)) {
          selected.push(...(raw as DayKey[]))
        } else if (raw) {
          selected.push(raw as DayKey)
        }
        if (selected.length === 0) {
          throw new Error(errorMessages.createGroup.createGroupWhenSelect)
        }

        return true
      }),

      ...DAY_CONFIG.flatMap(({ key, idBase, label }) => {
        const prettyDay = label.endsWith('s') ? label.slice(0, -1) : label

        return [
          // Hour field validation
          body(`${idBase}-hour`)
            .if(
              body('days-of-week').custom((_, { req }) => {
                return this.doesSelectedIncludeKey(req.body['days-of-week'], key)
              }),
            )
            .notEmpty()
            .withMessage(`${errorMessages.createGroup.createGroupWhenHourRequired} for ${prettyDay}`)
            .bail()
            .isInt({ min: 1, max: 12 })
            .withMessage(`${errorMessages.createGroup.createGroupWhenHourInvalid} for ${prettyDay}`),
          // Minute field validation
          body(`${idBase}-minute`)
            .if(
              body('days-of-week').custom((_, { req }) => {
                return this.doesSelectedIncludeKey(req.body['days-of-week'], key)
              }),
            )
            .optional({ checkFalsy: true })
            .isInt({ min: 0, max: 59 })
            .withMessage(`${errorMessages.createGroup.createGroupWhenMinutesInvalid} for ${prettyDay}`),

          // AM/PM field validation
          body(`${idBase}-ampm`)
            .if(
              body('days-of-week').custom((_, { req }) => {
                return this.doesSelectedIncludeKey(req.body['days-of-week'], key)
              }),
            )
            .notEmpty()
            .withMessage(`${errorMessages.createGroup.createGroupWhenAmOrPmRequired} for ${prettyDay}`),
        ]
      }),
    ]
  }

  private doesSelectedIncludeKey(dayOfWeek: DayKey | DayKey[], key: DayKey): boolean {
    let selected: DayKey[] = []
    if (Array.isArray(dayOfWeek)) {
      selected = dayOfWeek
    } else if (dayOfWeek) {
      selected = [dayOfWeek]
    }
    return selected.includes(key)
  }

  private createGroupPduValidations(): ValidationChain[] {
    return [body('create-group-pdu').notEmpty().withMessage(errorMessages.createGroup.createGroupPduEmpty)]
  }

  private createGroupLocationValidations(): ValidationChain[] {
    return [body('create-group-location').notEmpty().withMessage(errorMessages.createGroup.createGroupLocationEmpty)]
  }

  private createGroupTreatmentManagerValidations(): ValidationChain[] {
    const hasFacilitator = Object.entries(this.request.body).some(
      ([key, value]) => key.startsWith('create-group-facilitator') && value !== '',
    )
    return [
      body('create-group-treatment-manager')
        .notEmpty()
        .withMessage(errorMessages.createGroup.createGroupTreatmentManagerEmpty),
      body('create-group-facilitator')
        .custom(() => {
          return hasFacilitator
        })
        .withMessage(errorMessages.createGroup.createGroupFacilitatorEmpty),
    ]
  }
}
