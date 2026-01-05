import { SessionScheduleGettingStarted, SessionScheduleOnetoOne } from '@manage-and-deliver-api'
import { ValueTextTuple } from '@manage-and-deliver-ui'

export default class SessionScheduleUtils {
  sessionScheduleGettingStarted: ValueTextTuple[] = [
    { value: 'GETTING_STARTED_1_CATCH_UP' as SessionScheduleGettingStarted, text: 'Getting started 1 catch-up' },
    {
      value: 'GETTING_STARTED_2_CATCH_UP' as SessionScheduleGettingStarted,
      text: 'Getting started 2 catch-up',
    },
    { value: 'GETTING_STARTED_ONE_TO_ONE' as SessionScheduleGettingStarted, text: 'Getting started one-to-one' },
    {
      value: 'GETTING_STARTED_ONE_TO_ONE_CATCH_UP' as SessionScheduleGettingStarted,
      text: 'Getting started one-to-one catch-up',
    },
  ] as const

  getSessionScheduleGettingStartedTextFromEnum = (value: SessionScheduleGettingStarted): string => {
    return this.getTextFromEnum(this.sessionScheduleGettingStarted, value)
  }

  getSessionScheduleGettingStartedEnumFromText = (text: string): SessionScheduleGettingStarted | undefined => {
    return this.getEnumFromText(this.sessionScheduleGettingStarted, text)
  }

  sessionScheduleOnetoOne: ValueTextTuple[] = [
    { value: 'PREGROUP_ONE_TO_ONE' as SessionScheduleOnetoOne, text: 'Pre-group one-to-one' },
    { value: 'PREGROUP_ONE_TO_ONE_CATCH_UP' as SessionScheduleOnetoOne, text: 'Pre-group one-to-one catch-up' },
  ] as const

  getSessionScheduleOnetoOneTextFromEnum = (value: SessionScheduleOnetoOne): string => {
    return this.getTextFromEnum(this.sessionScheduleOnetoOne, value)
  }

  getSessionScheduleOnetoOneEnumFromText = (text: string): SessionScheduleOnetoOne | undefined => {
    return this.getEnumFromText(this.sessionScheduleOnetoOne, text)
  }

  private getTextFromEnum<T>(enumArray: readonly ValueTextTuple[], value: T): string {
    return enumArray.find(option => option.value === value)?.text
  }

  private getEnumFromText<T>(enumArray: readonly ValueTextTuple[], text: string): T | undefined {
    return enumArray.find(option => option.text === text)?.value
  }
}
