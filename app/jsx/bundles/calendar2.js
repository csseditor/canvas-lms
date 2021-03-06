// this is responsible for gluing all the calendar parts together into a complete page
// the only thing on the erb page should be `calendarApp.init(<contexts>, <manageContexts>);`
import $ from 'jquery'
import Calendar from 'compiled/calendar/Calendar'
import ReactDOM from 'react-dom'
import React from 'react'
import MiniCalendar from 'compiled/calendar/MiniCalendar'
import FindAppointment from 'jsx/calendar/scheduler/components/FindAppointment'
import CalendarHeader from 'compiled/views/calendar/CalendarHeader'
import drawSidebar from 'compiled/calendar/sidebar'
import EventDataSource from 'compiled/calendar/EventDataSource'
import UndatedEventsList from 'compiled/calendar/UndatedEventsList'
import configureSchedulerStore from 'jsx/calendar/scheduler/store/configureStore'
import 'compiled/jquery.kylemenu'

const eventDataSource = new EventDataSource(ENV.CALENDAR.CONTEXTS)

const schedulerStore = ENV.CALENDAR.BETTER_SCHEDULER ? configureSchedulerStore() : null

const header = new CalendarHeader({
  el: '#calendar_header',
  calendar2Only: ENV.CALENDAR.CAL2_ONLY,
  showScheduler: ENV.CALENDAR.SHOW_SCHEDULER && !ENV.CALENDAR.BETTER_SCHEDULER
})

const calendar = new Calendar('#calendar-app', ENV.CALENDAR.CONTEXTS, ENV.CALENDAR.MANAGE_CONTEXTS, eventDataSource, {
  activateEvent: ENV.CALENDAR.ACTIVE_EVENT,
  viewStart: ENV.CALENDAR.VIEW_START,
  showScheduler: ENV.CALENDAR.SHOW_SCHEDULER,
  header,
  userId: ENV.current_user_id,
  schedulerStore,
  onLoadAppointmentGroups: (agMap) => {
    if (ENV.CALENDAR.BETTER_SCHEDULER) {
      const courses = eventDataSource.contexts.filter(context => agMap.hasOwnProperty(context.asset_string))
      if (courses.length > 0) {
        ReactDOM.render(
          <FindAppointment courses={courses} store={schedulerStore} />,
          $('#select-course-component')[0]
        )
      }
    }
  }
})

new MiniCalendar('#minical', calendar)
new UndatedEventsList('#undated-events', eventDataSource, calendar)
drawSidebar(ENV.CALENDAR.CONTEXTS, ENV.CALENDAR.SELECTED_CONTEXTS, eventDataSource)

let keyboardUser = true

$('.calendar-button').on('mousedown', (e) => {
  keyboardUser = false
  $(e.target).find('.accessibility-warning').addClass('screenreader-only')
})

$(document).on('keydown', (e) => {
  if (e.which === 9) { // checking for tab press
    keyboardUser = true
  }
})

$('.calendar-button').on('focus', (e) => {
  if (keyboardUser) {
    $(e.target).find('.accessibility-warning').removeClass('screenreader-only')
  }
})

$('.calendar-button').on('focusout', e =>
  $(e.target).find('.accessibility-warning').addClass('screenreader-only')
)

$('.rs-section .accessibility-warning').on('focus', e =>
  $(e.target).removeClass('screenreader-only')
)

$('.rs-section .accessibility-warning').on('focusout', e =>
  $(e.target).addClass('screenreader-only')
)
