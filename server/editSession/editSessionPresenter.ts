export default class EditSessionPresenter {
  constructor() {}

  get text() {
    return {
      pageHeading: `Getting started 1: Introduction to Building Choices`,
      pageCaption: 'BCCDD1',
      subHeading: 'Attendance and session notes',
    }
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: 'Add URL',
    }
  }
}
