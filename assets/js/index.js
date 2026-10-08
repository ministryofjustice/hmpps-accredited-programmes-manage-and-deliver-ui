import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import ModalDialog from './modelTimeOutDialog.js'

govukFrontend.initAll()
mojFrontend.initAll()

// Keep excluded (restricted) referrals pinned to the bottom of the sortable tables (caselist,
// group allocations and waitlist), regardless of which column/direction the user sorts by. The MOJ
// component re-sorts the tbody on load and on every header click, so we re-pin after each sort.
const pinExcludedRowsToBottom = table => {
  const tbody = table.querySelector('tbody')
  if (!tbody) return
  Array.from(tbody.querySelectorAll('tr'))
    .filter(row => row.querySelector('[data-excluded="true"]'))
    .forEach(row => tbody.appendChild(row))
}

document.querySelectorAll('[data-caselist-table="true"]').forEach(table => {
  pinExcludedRowsToBottom(table)
  const thead = table.querySelector('thead')
  if (thead) {
    thead.addEventListener(
      'click',
      event => {
        const target = event.target instanceof Element ? event.target : null
        if (!target) return

        const clickable = target.closest('a, button')
        const header = clickable ? clickable.closest('th') : null
        const sortUrl =
          (clickable && clickable.tagName === 'A' ? clickable.getAttribute('href') : null) ||
          (header ? header.getAttribute('data-sort-url') : null)
        if (!sortUrl) return

        event.preventDefault()
        event.stopImmediatePropagation()
        window.location.assign(sortUrl)
      },
      { capture: true },
    )
    thead.addEventListener('click', () => pinExcludedRowsToBottom(table))
  }
})

// Progressive enhancement for the collapsible checkbox filter: filter the list of
// checkboxes as the user types into the search box. Checked options always remain
// visible so a current selection is never hidden.
document.querySelectorAll('[data-checkbox-filter-search]').forEach(searchInput => {
  const container = searchInput.closest('[data-checkbox-filter]')
  if (!container) return

  const items = Array.from(container.querySelectorAll('.govuk-checkboxes__item'))
  const noResults = container.querySelector('[data-checkbox-filter-no-results]')

  const filterItems = () => {
    const query = searchInput.value.trim().toLowerCase()
    let visibleCount = 0

    items.forEach(item => {
      const label = item.querySelector('.govuk-checkboxes__label')
      const checkbox = item.querySelector('.govuk-checkboxes__input')
      const labelText = label ? label.textContent.trim().toLowerCase() : ''
      const isChecked = checkbox ? checkbox.checked : false
      const matches = query === '' || labelText.includes(query) || isChecked
      item.hidden = !matches
      item.style.display = matches ? '' : 'none'
      if (matches) visibleCount += 1
    })

    if (noResults) {
      noResults.classList.toggle('govuk-visually-hidden', visibleCount !== 0)
    }
  }

  searchInput.addEventListener('input', filterItems)
})

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
