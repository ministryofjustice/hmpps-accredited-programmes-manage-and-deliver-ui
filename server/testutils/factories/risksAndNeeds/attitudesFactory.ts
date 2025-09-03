import { Attitude } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class AttitudeFactory extends Factory<Attitude> {}

export default AttitudeFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  proCriminalAttitudes: '1 - Some problems',
  motivationToAddressBehaviour: '1 - Quite motivated',
}))
