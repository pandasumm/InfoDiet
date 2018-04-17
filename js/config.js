"use strict";
var DEVELOPMENT_MODE = !("update_url" in chrome.runtime.getManifest()),
  SKIP_RESTORE_HASH_CHECK = !("update_url" in chrome.runtime.getManifest()),
  SCREENSHOT_MODE = !1,
  SCREENSHOT_MODE_QUERY = "?screenshot=on",
  SCREENSHOT_WAIT = 50,
  SCREENSHOT_INSTRUCTIONS_READ_DEFAULT = !1,
  SCROLLBAR_WIDTH = "12",
  BADGE_DISPLAY_DEFAULT = !0,
  INTERVAL_UPDATE_S = 1,
  INTERVAL_UPDATE_MS = 1e3 * INTERVAL_UPDATE_S,
  INTERVAL_SAVE_MS = 6e4,
  INTERVAL_UI_LOADING = 2e3,
  UI_LOADING_BLINKING_INTERVAL = 600,
  UI_LOADING_BLINKING_COUNT = 3,
  IDLE_TIME_DEFAULT = 30,
  RESOLUTION_HOURS = "h",
  RESOLUTION_DAYS = "d",
  TIME_UNIT_DAY = "d",
  TIME_UNIT_HOUR = "h",
  TIME_UNIT_MINUTE = "m",
  TIME_UNIT_SECOND = "s",
  RANGE_TODAY = "today",
  RANGE_AVERAGE = "average",
  RANGE_ALLTIME = "alltime",
  GRAPH_SIZE = 240,
  GRAPH_COLOR_OTHER = "hsl(0, 0%, 50%)",
  GRAPH_MIN_PERCENTAGE_TO_INCLUDE = 1.5,
  GRAPH_GAP_DEFAULT = .4,
  CHART_STATS_STEP_HEIGHT_MIN = 1,
  CHART_STATS_HEIGHT_DAYS = 60,
  CHART_STATS_HEIGHT_DAYNAMES = 60,
  BLACKLIST_DOMAIN = [],
  BLACKLIST_PROTOCOL = ["chrome:", "chrome-extension:"],
  IDLE_TIME_TABLE = [15, IDLE_TIME_DEFAULT, 45, 60, 90, 120, 180, 240, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3e3, 3300, 3600, 7200],
  GRAPH_GAP_TABLE = [0, .1, .2, .3, GRAPH_GAP_DEFAULT, .5, .6, .7, .8, .9, 1];