import { CardGroupArgs } from '@manage-and-deliver-ui'
import HomePresenter from './homePresenter'

export default class HomeView {
  constructor(private readonly presenter: HomePresenter) {}

  private get cardGroupArgs(): CardGroupArgs {
    return [
      {
        dataTest: 'case-list',
        href: '/pdu/open-referrals',
        title: 'Case list',
        description: 'Track and update referrals for your region',
      },
      {
        dataTest: 'groups',
        href: '/groups/not-started-or-in-progress',
        title: 'Groups',
        description: 'Create groups, schedule sessions, and record attendance and notes',
      },
    ]
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'home/home.njk',
      {
        presenter: this.presenter,
        text: this.presenter.text,
        cardGroupArgs: this.cardGroupArgs,
      },
    ]
  }
}
