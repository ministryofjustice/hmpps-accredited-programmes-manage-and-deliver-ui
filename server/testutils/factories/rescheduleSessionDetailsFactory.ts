import { Factory } from 'fishery'
import { RescheduleSessionDetails } from '@manage-and-deliver-api'

class RescheduleSessionDetailsFactory extends Factory<RescheduleSessionDetails> {}

export default RescheduleSessionDetailsFactory.define(({ sequence }) => ({
  sessionId: sequence.toString(),
  sessionName: 'Test Session',
  previousSessionDateAndTime: '2025-03-15T09:30:00',
}))
