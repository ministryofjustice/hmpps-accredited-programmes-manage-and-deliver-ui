import { Session } from '@manage-and-deliver-api'
import DeleteSessionPresenter from './deleteSessionPresenter'

describe('DeleteSessionPresenter', () => {
  const groupId = 'group-123'
  const backUrl = '/back'

  describe('generatePageCaption', () => {
    it('should return caption for individual post programme review', () => {
      const sessionDetails: Session = {
        type: 'Individual',
        name: 'Post programme review',
        referrals: [{ personName: 'Alex River' }],
      } as Session

      const presenter = new DeleteSessionPresenter(groupId, backUrl, sessionDetails)

      expect(presenter.text.pageCaption).toBe('Delete Alex River: Post-programme review')
    })

    it('should return caption for individual catch-up session', () => {
      const sessionDetails: Session = {
        type: 'Individual',
        name: 'Getting started',
        isCatchup: true,
        referrals: [{ personName: 'Alex River' }],
      } as Session

      const presenter = new DeleteSessionPresenter(groupId, backUrl, sessionDetails)

      expect(presenter.text.pageCaption).toBe('Delete Alex River: Getting started one-to-one catch-up')
    })

    it('should return caption for regular individual session', () => {
      const sessionDetails: Session = {
        type: 'Individual',
        name: 'Getting started',
        isCatchup: false,
        referrals: [{ personName: 'Alex River' }],
      } as Session

      const presenter = new DeleteSessionPresenter(groupId, backUrl, sessionDetails)

      expect(presenter.text.pageCaption).toBe('Delete Alex River: Getting started one-to-one')
    })

    it('should return caption for group session', () => {
      const sessionDetails: Session = {
        type: 'Group',
        name: 'Getting started',
        number: 1,
      } as Session

      const presenter = new DeleteSessionPresenter(groupId, backUrl, sessionDetails)

      expect(presenter.text.pageCaption).toBe('Delete Getting started 1 catch-up')
    })

    it('should return default caption for unknown session type', () => {
      const sessionDetails: Session = {
        type: 'Unknown',
        name: 'Getting started',
      } as Session

      const presenter = new DeleteSessionPresenter(groupId, backUrl, sessionDetails)

      expect(presenter.text.pageCaption).toBe('Delete Getting started')
    })
  })
})
