import { ThinkingAndBehaviour } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class ThinkingAndBehaviourFactory extends Factory<ThinkingAndBehaviour> {}

export default ThinkingAndBehaviourFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  temperControl: '1 - Some problems',
  problemSolvingSkills: '1 - Some problems',
  awarenessOfConsequences: '2 - Serious problems',
  understandsViewsOfOthers: '2 - Serious problems',
  achieveGoals: '2 - Serious problems',
  concreteAbstractThinking: '0 - No problems',
}))
