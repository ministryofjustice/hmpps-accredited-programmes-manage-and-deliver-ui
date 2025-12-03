import { CreateGroupSessionSlot } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class CreateGroupSessionSlotFactory extends Factory<CreateGroupSessionSlot> {}

export default CreateGroupSessionSlotFactory.define(() => ({
  dayOfWeek: 'MONDAY' as CreateGroupSessionSlot['dayOfWeek'],
  hour: 10,
  minutes: 30,
  amOrPm: 'AM' as 'AM' | 'PM',
}))
