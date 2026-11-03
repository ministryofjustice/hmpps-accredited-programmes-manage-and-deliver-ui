import { ScheduleSessionTypeResponse } from '@manage-and-deliver-api'

export default function hasSessionTypeChoice(
  template: ScheduleSessionTypeResponse['sessionTemplates'][number],
): boolean {
  const name = template.name.replace(/ catch-up$/, '')
  return name !== 'Pre-group one-to-one' && name !== 'Post-programme review'
}
