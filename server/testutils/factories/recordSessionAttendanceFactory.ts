import { RecordSessionAttendance } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class RecordSessionAttendanceFactory extends Factory<RecordSessionAttendance> {}

export default RecordSessionAttendanceFactory.define(({ sequence }) => {
  const people = [
    {
      referralId: `${sequence}-0`,
      name: 'Alice Brown',
      crn: 'X123456',
      attendance: { text: 'Attended', code: 'ATTC' },
      options: [
        {
          text: 'Attended',
          value: 'ATTC',
        },
        {
          text: 'Attended but failed to comply',
          subtext: 'For example, they could not participate because of drug or alcohol use',
          value: 'AFTC',
        },
        {
          text: 'No - did not attend',
          value: 'UAAB',
        },
      ],
    },
    {
      referralId: `${sequence}-1`,
      name: 'Bob Smith',
      crn: 'X933591',
      attendance: { text: 'Absent - not notified', code: 'UAAB' },
      options: [
        {
          text: 'Attended',
          value: 'ATTC',
        },
        {
          text: 'Attended but failed to comply',
          subtext: 'For example, they could not participate because of drug or alcohol use',
          value: 'AFTC',
        },
        {
          text: 'No - did not attend',
          value: 'UAAB',
        },
      ],
    },
  ]

  return {
    sessionTitle: `Getting started ${sequence}`,
    groupRegionName: 'North East',
    people,
  }
})
