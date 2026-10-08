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

// Persist the open/closed state of each collapsible filter panel, but only across an
// "Apply filters" submission - not plain refreshes or returning to the page. On submit
// we snapshot which panels are open; on the next load we restore them once and then clear
// the snapshot, so a subsequent refresh starts from the default (collapsed) state.
;(() => {
  const panels = Array.from(document.querySelectorAll('.govuk-details[data-qa$="-filter-section"]'))
  if (panels.length === 0) return

  // Share the snapshot across the open/closed referral tabs by normalising the tab
  // segment of the path, so applying filters on one tab keeps the same panels open
  // when switching to the other.
  const normalisedPath = window.location.pathname.replace(/(open|closed)-referrals/, 'referrals')
  const storageKey = `filter-panels-open:${normalisedPath}`

  const readOpenPanels = () => {
    try {
      return JSON.parse(window.sessionStorage.getItem(storageKey)) || []
    } catch (error) {
      return []
    }
  }

  const saveOpenPanels = () => {
    const openPanels = panels.filter(panel => panel.open).map(panel => panel.getAttribute('data-qa'))
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(openPanels))
    } catch (error) {
      // Ignore storage write errors (e.g. disabled cookies/private mode).
    }
  }

  // Restore the panels saved by the last intentional navigation (applying filters or
  // switching referral tabs), then immediately clear the snapshot. This "consume once"
  // approach means any other navigation - refreshing, or leaving and returning to the
  // page - finds no snapshot and starts from the default collapsed state.
  const openOnLoad = readOpenPanels()
  if (openOnLoad.length > 0) {
    panels.forEach(panel => {
      if (openOnLoad.includes(panel.getAttribute('data-qa'))) {
        panel.open = true
      }
    })
  }
  try {
    window.sessionStorage.removeItem(storageKey)
  } catch (error) {
    // Ignore storage access errors (e.g. disabled cookies/private mode).
  }

  // Snapshot open panels when applying filters or switching referral tabs so the
  // state carries across those navigations only.
  const filterForm = document.querySelector('[data-filter-form]')
  if (filterForm) {
    filterForm.addEventListener('submit', saveOpenPanels)
  }
  document.querySelectorAll('.moj-sub-navigation__link').forEach(tabLink => {
    tabLink.addEventListener('click', saveOpenPanels)
  })
})()

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
