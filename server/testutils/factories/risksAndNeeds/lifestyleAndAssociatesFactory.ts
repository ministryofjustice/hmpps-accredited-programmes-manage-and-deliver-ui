import { LifestyleAndAssociates } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class LifestyleAndAssociatesFactory extends Factory<LifestyleAndAssociates> {}

export default LifestyleAndAssociatesFactory.define(() => ({
  assessmentCompleted: '23 August 2025',
  regActivitiesEncourageOffending: '1 - Some problems',
  lifestyleIssuesDetails: 'There are issues around involvement with drugs',
}))
