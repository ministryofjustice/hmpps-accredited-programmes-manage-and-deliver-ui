import { DrugDetails } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class DrugDetailsFactory extends Factory<DrugDetails> {}

export default DrugDetailsFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  levelOfUseOfMainDrug: '1 - Some problems',
  drugsMajorActivity: 'More than once a week',
}))
