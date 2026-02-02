/**
 * Firebase Analytics event names and parameter keys.
 * Event names: snake_case, max 40 chars (Firebase recommends).
 * Param keys: snake_case, max 40 chars.
 */

export const ANALYTICS_EVENTS = {
  BUTTON_CLICK: 'button_click',
  TAB_SELECT: 'tab_select',
  SEGMENT_SELECT: 'segment_select',
  DROPDOWN_OPEN: 'dropdown_open',
  DROPDOWN_SELECT: 'dropdown_select',
  DROPDOWN_CONFIRM: 'dropdown_confirm',
} as const;

export const ANALYTICS_PARAMS = {
  SCREEN_NAME: 'screen_name',
  BUTTON_NAME: 'button_name',
  TAB_ID: 'tab_id',
  SEGMENT: 'segment',
  VALUE: 'value',
} as const;

export const SCREENS = {
  SPLASH: 'splash',
  HOME: 'home',
  PORTFOLIO: 'portfolio',
  REWARDS: 'rewards',
  MARKET: 'market',
  PROFILE: 'profile',
} as const;
