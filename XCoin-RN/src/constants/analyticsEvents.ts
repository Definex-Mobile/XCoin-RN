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

export const PARAMS = {
  HISTORY: 'history',
  BANK_DETAILS: 'bank_details',
  NOTIFICATION: 'notifications',
  SECURITY: 'security',
  HELP_SUPPORT: 'help_support',
  TERMS_COND: 'terms_conditions',
  SEARCH: 'search',
  WELCOME_BANNER_CTA: 'welcome_banner_cta',
  EXIT: 'exit',
  UPDATE: 'update',
  DEPOSIT_INR: 'deposit_inr',
  WITHDRAW_INR: 'withdraw_inr',
} as const; 
