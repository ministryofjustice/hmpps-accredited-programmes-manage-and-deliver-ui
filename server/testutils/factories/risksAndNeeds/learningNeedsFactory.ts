import { LearningNeeds } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class LearningNeedsFactory extends Factory<LearningNeeds> {}

export default LearningNeedsFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  noFixedAbodeOrTransient: true,
  workRelatedSkills: '1-Some problems',
  problemsReadWriteNum: '1-Some problems',
  learningDifficulties: '0-No problems',
  problemAreas: [
    'Difficulty with concentration',
    'Problems with memory retention',
    'Struggles with following instructions',
  ],
  qualifications: '0 - Any qualifications',
  basicSkillsScore: '3',
  basicSkillsScoreDescription:
    'Ms Puckett told me that her formal school education was regularly interrupted as she and her family travelled a lot whilst she was growing up.',
}))
