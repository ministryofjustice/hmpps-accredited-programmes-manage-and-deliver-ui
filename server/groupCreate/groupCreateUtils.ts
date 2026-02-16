import { ProgrammeGroupCohortEnum, ProgrammeGroupSexEnum } from '@manage-and-deliver-api'
import { ValueTextTuple } from '@manage-and-deliver-ui'

export default class CreateGroupUtils {
  programmeGroupCohortEnum: ValueTextTuple[] = [
    { value: 'GENERAL' as ProgrammeGroupCohortEnum, text: 'General offence' },
    {
      value: 'GENERAL_LDC' as ProgrammeGroupCohortEnum,
      text: 'General offence, learning disabilities and challenges (LDC)',
    },
    { value: 'SEXUAL' as ProgrammeGroupCohortEnum, text: 'Sexual offence' },
    {
      value: 'SEXUAL_LDC' as ProgrammeGroupCohortEnum,
      text: 'Sexual offence, learning disabilities and challenges (LDC)',
    },
  ] as const

  getCohortTextFromEnum = (value: ProgrammeGroupCohortEnum): string => {
    return this.getTextFromEnum(this.programmeGroupCohortEnum, value)
  }

  getCohortEnumFromText = (text: string): ProgrammeGroupCohortEnum | undefined => {
    return this.getEnumFromText(this.programmeGroupCohortEnum, text)
  }

  programmeGroupSexEnum: ValueTextTuple[] = [
    { value: 'MALE' as ProgrammeGroupSexEnum, text: 'Male' },
    { value: 'FEMALE' as ProgrammeGroupSexEnum, text: 'Female' },
    { value: 'MIXED' as ProgrammeGroupSexEnum, text: 'Mixed' },
  ] as const

  getSexTextFromEnum = (value: ProgrammeGroupSexEnum): string => {
    return this.getTextFromEnum(this.programmeGroupSexEnum, value)
  }

  getSexEnumFromText = (text: string): ProgrammeGroupSexEnum | undefined => {
    return this.getEnumFromText(this.programmeGroupSexEnum, text)
  }

  private getTextFromEnum<T>(enumArray: readonly ValueTextTuple[], value: T): string {
    return enumArray.find(option => option.value === value)?.text
  }

  private getEnumFromText<T>(enumArray: readonly ValueTextTuple[], text: string): T | undefined {
    return enumArray.find(option => option.text === text)?.value
  }
}
