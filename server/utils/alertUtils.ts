import { MojAlertComponentBase } from '../interfaces/alertComponentArgs'

const successAriaAttributes = {
  'aria-live': 'assertive',
  'aria-atomic': 'true',
}

const withSuccessScreenReaderAnnouncement = <T extends MojAlertComponentBase>(alertArgs: T): T => {
  if (alertArgs.variant !== 'success') {
    return alertArgs
  }

  return {
    ...alertArgs,
    role: 'alert',
    attributes: {
      ...alertArgs.attributes,
      ...successAriaAttributes,
    },
  }
}

export default withSuccessScreenReaderAnnouncement
