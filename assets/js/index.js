import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import ModalDialog from './modelTimeOutDialog.js'

govukFrontend.initAll()
mojFrontend.initAll()

const $inactivityWarningModal = document.querySelector('[data-modal-type="inactivity-warning"]')
if ($inactivityWarningModal) {
  const INACTIVITY_TIMEOUT = 50 * 60 * 1000
  const MODAL_LOGOUT_TIMEOUT = 10 * 60 * 1000
  const SIGN_OUT_PATH = '/sign-out'
  const activityEvents = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart']
  let inactivityTimerId
  let signOutTimerId
  let modalDialog

  const clearSignOutTimer = () => {
    window.clearTimeout(signOutTimerId)
  }

  const redirectToSignOut = () => {
    const returnTo = `${window.location.pathname}${window.location.search}`
    const signOutUrl = `${SIGN_OUT_PATH}?returnTo=${encodeURIComponent(returnTo)}`
    window.location.assign(signOutUrl)
  }

  const startSignOutTimer = () => {
    clearSignOutTimer()
    signOutTimerId = window.setTimeout(redirectToSignOut, MODAL_LOGOUT_TIMEOUT)
  }

  const startInactivityTimer = () => {
    window.clearTimeout(inactivityTimerId)
    inactivityTimerId = window.setTimeout(() => {
      if (!modalDialog.isOpen()) {
        modalDialog.open()
      }
    }, INACTIVITY_TIMEOUT)
  }

  const handleActivity = () => {
    if (!modalDialog.isOpen()) {
      startInactivityTimer()
    }
  }

  modalDialog = new ModalDialog($inactivityWarningModal).init({
    onOpen: startSignOutTimer,
    onClose: () => {
      clearSignOutTimer()
      startInactivityTimer()
    },
  })

  if (modalDialog) {
    activityEvents.forEach(eventName => {
      document.addEventListener(eventName, handleActivity, { passive: true })
    })

    startInactivityTimer()
  }
}
