import ApplyTheme from 'instructure-ui/lib/components/ApplyTheme'
import 'instructure-ui/lib/themes/canvas'
import moment from 'moment'
import tz from 'timezone_core'
import './fakeRequireJSFallback'

// we already put a <script> tag for the locale corresponding ENV.MOMENT_LOCALE
// on the page from rails, so this should not cause a new network request.
moment().locale(ENV.MOMENT_LOCALE)

// These timezones and locales should already be put on the page as <script>
// tags from rails. this block should not create any network requests.
if (typeof ENV !== 'undefined') {
  if (ENV.TIMEZONE) tz.changeZone(ENV.TIMEZONE)
  if (ENV.CONTEXT_TIMEZONE) tz.preload(ENV.CONTEXT_TIMEZONE)
  if (ENV.BIGEASY_LOCALE) tz.changeLocale(ENV.BIGEASY_LOCALE, ENV.MOMENT_LOCALE)
}

// setup the inst-ui default theme
if (ENV.use_high_contrast) {
  ApplyTheme.setDefaultTheme('canvas-a11y')
} else {
  const brandvars = window.CANVAS_ACTIVE_BRAND_VARIABLES || {}
  ApplyTheme.setDefaultTheme('canvas', brandvars)
}
