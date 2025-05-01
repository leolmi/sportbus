import { Page } from './page';

export const SPORTBUS_AUTHOR_LINK = 'https://github.com/leolmi/sportbus';
export const SPORTBUS_NAME = 'SportBus';
export const BUS_PREFIX = [`%c${SPORTBUS_NAME}`, 'color:#111;background-color:yellowgreen;padding:2px 6px;'];
export const SPORTBUS_SESSION_DEVELOP = 'develop';
export const SPORTBUS_SESSION_STANDARD = 'standard';
export const SPORTBUS_TITLE = SPORTBUS_NAME;
export const SPORTBUS_AUTHOR = 'leo.olmi 2025';
export const SPORTBUS_DEBUG_LEVELS_KEY = '';
export const SPORTBUS_APP_USER_OPTIONS_KEY = 'SPORTBUS-USER-OPTIONS';
export const SPORTBUS_USER_OPTIONS_FEATURE = 'user_options';
export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';
export const DEFAULT_THEME = THEME_LIGHT;

export const THEME_ICON: any = {
  [THEME_LIGHT]: 'light_mode',
  [THEME_DARK]: 'dark_mode'
}
export const THEME_OTHER: any = {
  [THEME_LIGHT]: THEME_DARK,
  [THEME_DARK]: THEME_LIGHT
}
export const THEME_CLASS: any = {
  [THEME_LIGHT]: 'theme-light',
  [THEME_DARK]: 'theme-dark'
}

export const SPORTBUS_SESSION_POLLING_TIMEOUT = 2000;

export const SYSTEM_MENU_CODE: any = {
  home: 'system-go-home',
  restoreSettings: 'system-restore-settings',
  darkTheme: 'system-dark-theme',
  lightTheme: 'system-light-theme',
  globalDebug: 'system-debug-mode',
  management: 'system-open-management'
}

export const SYSTEM_MENU_ITEMS: any = {
  home: {
    code: SYSTEM_MENU_CODE.home,
    icon: 'home',
    text: 'Go home',
    logic: 'system',
  },
  lightTheme: {
    code: SYSTEM_MENU_CODE.lightTheme,
    icon: 'light_mode',
    text: 'Switch to light theme',
    logic: 'system',
  },
  darkTheme: {
    code: SYSTEM_MENU_CODE.darkTheme,
    icon: 'dark_mode',
    text: 'Switch to dark theme',
    logic: 'system',
  },
  restoreSettings: {
    code: SYSTEM_MENU_CODE.restoreSettings,
    icon: 'settings_backup_restore',
    text: 'Restore default settings',
    logic: 'system',
  },
  globalDebug: {
    code: SYSTEM_MENU_CODE.globalDebug,
    icon: 'bug_report',
    text: 'Debug mode',
    logic: 'system',
  },
  management: {
    code: SYSTEM_MENU_CODE.management,
    icon: 'settings',
    text: 'Open management page',
    logic: 'system',
  }
}

export const DAY: any = {
  0: 'domenica',
  1: 'lunedì',
  2: 'martedì',
  3: 'mercoledì',
  4: 'goivedì',
  5: 'venerdì',
  6: 'sabato',
}

export const MONTH: any = {
  0: 'gennaio',
  1: 'febbraio',
  2: 'marzo',
  3: 'aprile',
  4: 'maggio',
  5: 'giugno',
  6: 'luglio',
  7: 'agosto',
  8: 'settembre',
  9: 'ottobre',
  10: 'novembre',
  11: 'dicembre',
}

export const WEEK_DAYS = [
  { num:1, label: 'Lunedì', small: 'L' },
  { num:2, label: 'Martedì', small: 'M' },
  { num:3, label: 'Mercoledì', small: 'M' },
  { num:4, label: 'Giovedì', small: 'G' },
  { num:5, label: 'Venerdì', small: 'V' },
  { num:6, label: 'Sabato', small: 'S' },
  { num:0, label: 'Domenica', small: 'D' },
]

export const PAGE_CODE: any = {
  shuttle: 'shuttle',
  settings: 'settings'
}

export const PAGES: Page[] = [{
  code: PAGE_CODE.shuttle,
  icon: 'airport_shuttle',
  title: 'Shuttle'
}, {
  code: PAGE_CODE.settings,
  icon: 'settings',
  title: 'Settings'
}]
