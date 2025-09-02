import { EmotionalWellbeing } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class EmotionalWellbeingFactory extends Factory<EmotionalWellbeing> {}

export default EmotionalWellbeingFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  currentPsychologicalProblems: '1 - Some problems',
  selfHarmSuicidal: '1 - Some problems',
  currentPsychiatricProblems: '0 - No problems',
}))
