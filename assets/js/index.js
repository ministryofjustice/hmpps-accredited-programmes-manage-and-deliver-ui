import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import ModalDialog from './modelTimeOutDialog.js'

govukFrontend.initAll()
mojFrontend.initAll()
//This gives screen readers a focused message to announce and lets keyboard users continue tabbing from the results, rather than starting at the top of the page.
if (window.location.hash === '#filter-results') {
  document.getElementById('filter-results')?.focus()
}

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
      const message = visibleCount === 0 ? 'No results found. Clear or change the filters.' : ''
      if (noResults.textContent !== message) {
        noResults.textContent = message
      }
      noResults.classList.toggle('govuk-visually-hidden', visibleCount !== 0)
    }
  }

  searchInput.addEventListener('input', filterItems)
})

// Persist the open/closed state of each collapsible filter panel so it is retained for the rest of
// the working day - including when the user leaves the case list and returns. The snapshot is kept
// in sessionStorage, date-stamped so that a new calendar day starts from the default (collapsed)
// state.
;(() => {
  const panels = Array.from(document.querySelectorAll('.govuk-details[data-qa$="-filter-section"]'))
  if (panels.length === 0) return

  // Share the snapshot across the open/closed referral tabs by normalising the tab
  // segment of the path, so the expanded/collapsed state is the same when switching tabs.
  const normalisedPath = window.location.pathname.replace(/(open|closed)-referrals/, 'referrals')
  const storageKey = `filter-panels-open:${normalisedPath}`

  // Local calendar day (YYYY-MM-DD) used to scope the retained state to the working day.
  const today = new Date().toLocaleDateString('en-CA')

  const readOpenPanels = () => {
    try {
      const stored = JSON.parse(window.sessionStorage.getItem(storageKey))
      if (!stored || stored.date !== today || !Array.isArray(stored.openPanels)) {
        return []
      }
      return stored.openPanels
    } catch (error) {
      return []
    }
  }

  const saveOpenPanels = () => {
    const openPanels = panels.filter(panel => panel.open).map(panel => panel.getAttribute('data-qa'))
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify({ date: today, openPanels }))
    } catch (error) {
      // Ignore storage write errors (e.g. disabled cookies/private mode).
    }
  }

  // Restore the panels that were open earlier in the day, then keep the snapshot so leaving and
  // returning to the case list retains the state.
  const openOnLoad = readOpenPanels()
  panels.forEach(panel => {
    panel.open = openOnLoad.includes(panel.getAttribute('data-qa'))
  })

  // Keep the snapshot in step with the latest state: whenever a panel is toggled, and on the
  // navigations that reload the page (applying filters or switching referral tabs).
  panels.forEach(panel => panel.addEventListener('toggle', saveOpenPanels))
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
