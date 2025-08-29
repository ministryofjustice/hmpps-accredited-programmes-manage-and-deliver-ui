import { AlcoholMisuseDetails } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class AlcoholMisuseFactory extends Factory<AlcoholMisuseDetails> {}

export default AlcoholMisuseFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  currentUse: '1-Some problems',
  bingeDrinking: '1-Some problems',
  frequencyAndLevel: '2-Significant problems',
  alcoholIssuesDetails: 'Alcohol dependency affecting employment and relationships',
}))
