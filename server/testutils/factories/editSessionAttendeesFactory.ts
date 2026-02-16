import { Factory } from 'fishery'
import { EditSessionAttendeesResponse, EditSessionAttendee } from '@manage-and-deliver-api'

class EditSessionAttendeesFactory extends Factory<EditSessionAttendeesResponse> {}

export default EditSessionAttendeesFactory.define(({ sequence }) => ({
  sessionId: sequence.toString(),
  sessionName: 'Test Session',
  sessionType: 'GROUP' as 'GROUP' | 'ONE_TO_ONE',
  isCatchup: false,
  attendees: [] as EditSessionAttendee[],
}))
