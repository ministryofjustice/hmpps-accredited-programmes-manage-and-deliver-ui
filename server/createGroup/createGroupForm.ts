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
        startedAtDate: this.request.body['create-group-date'],
      },
      error: null,
    }
  }

  async createGroupWhenData(): Promise<FormData<Partial<CreateGroupRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createGroupWhenValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      return {
        paramsForUpdate: null,
        error,
      }
    }

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

      ...DAY_CONFIG.map(({ key, idBase, label }) => {
        const prettyDay = label.endsWith('s') ? label.slice(0, -1) : label

        return body(`create-group-when-${idBase}`).custom((_, { req }) => {
          const raw = req.body['days-of-week']

          const selected: DayKey[] = []
          if (Array.isArray(raw)) {
            selected.push(...(raw as DayKey[]))
          } else if (raw) {
            selected.push(raw as DayKey)
          }

          if (!selected.includes(key)) {
            return true
          }

          const hour = (req.body[`${idBase}-hour`] ?? '').toString().trim()
          const minute = (req.body[`${idBase}-minute`] ?? '').toString().trim()
          const ampm = (req.body[`${idBase}-ampm`] ?? '').toString().trim()

          if (!hour) {
            throw new Error(`${errorMessages.createGroup.createGroupWhenHourRequired} for ${prettyDay}`)
          }

          const hourNumber = Number(hour)
          if (Number.isNaN(hourNumber) || hourNumber < 1 || hourNumber > 12) {
            throw new Error(`${errorMessages.createGroup.createGroupWhenHourInvalid} for ${prettyDay}`)
          }

          if (!ampm) {
            throw new Error(`${errorMessages.createGroup.createGroupWhenAmOrPmRequired} for ${prettyDay}`)
          }

          if (minute) {
            const minuteNumber = Number(minute)
            if (Number.isNaN(minuteNumber) || minuteNumber < 0 || minuteNumber > 59) {
              throw new Error(`${errorMessages.createGroup.createGroupWhenMinutesInvalid} for ${prettyDay}`)
            }
          }

          return true
        })
      }),
    ]
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
