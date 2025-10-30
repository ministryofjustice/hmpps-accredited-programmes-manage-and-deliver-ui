import Pagination from '../utils/pagination/pagination'

export default class CreateGroupStartPresenter {
  public readonly pagination: Pagination

  constructor() {}

  get backLinkUri() {
    return `/`
  }
}
