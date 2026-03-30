import { AttendanceHistoryResponse } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class AttendanceHistoryResponseFactory extends Factory<AttendanceHistoryResponse> {
  withNoSessions() {
    return this.params({
      attendanceHistory: [],
    })
  }

  withNoGroup() {
    return this.params({
      currentlyAllocatedGroupCode: undefined,
      currentlyAllocatedGroupId: undefined,
    })
  }

  withNoGroupAndNoSessions() {
    return this.params({
      currentlyAllocatedGroupCode: undefined,
      currentlyAllocatedGroupId: undefined,
      attendanceHistory: [],
    })
  }
}

export default AttendanceHistoryResponseFactory.define(({ sequence }) => ({
  popName: 'Alex River',
  currentlyAllocatedGroupCode: 'GRP-001',
  currentlyAllocatedGroupId: sequence.toString(),
  attendanceHistory: [
    {
      sessionId: 'session-1',
      sessionName: 'Pre-group one-to-one',
      groupCode: 'GRP-001',
      groupId: '1234567890',
      date: '11 July 2025',
      time: '10:30am to 11am',
      attendanceStatus: 'Attended - Complied',
      hasNotes: true,
    },
    {
      sessionId: 'session-2',
      sessionName: 'Session 1: Introduction',
      groupCode: 'GRP-001',
      groupId: '1234567890',
      date: '18 July 2025',
      time: '2pm to 3pm',
      attendanceStatus: 'Did not attend',
      hasNotes: false,
    },
  ],
}))
