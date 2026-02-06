import { Factory } from 'fishery'
import { EditSessionDetails } from '@manage-and-deliver-api'

class EditSessionDetailsFactory extends Factory<EditSessionDetails> {}

export default EditSessionDetailsFactory.define(({ sequence }) => ({
  sessionId: sequence.toString(),
  groupCode: 'session-1',
  sessionName: 'Test Session',
  sessionDate: '2025-03-15',
  sessionStartTime: {
    hour: 9,
    minutes: 30,
    amOrPm: 'AM' as 'AM' | 'PM',
  },
  sessionEndTime: {
    hour: 12,
    minutes: 0,
    amOrPm: 'PM' as 'AM' | 'PM',
  },
}))
