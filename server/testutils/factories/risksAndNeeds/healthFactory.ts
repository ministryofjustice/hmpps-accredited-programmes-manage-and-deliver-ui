import { Health } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class HealthFactory extends Factory<Health> {}

export default HealthFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  anyHealthConditions: true,
  description: 'Has mental health issues',
}))
