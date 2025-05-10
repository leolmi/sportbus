import { Locale } from './types';

export const SPORTBUS_AUTHOR_LINK = 'https://github.com/leolmi/sportbus';
export const SPORTBUS_NAME = 'Shuttles'; // 'OwnBus';
export const NAME_PART_STANDARD = '';
export const NAME_PART_ACCENT = SPORTBUS_NAME;
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
export const DEFAULT_LOCALE: Locale = 'it';

export const MANAGEMENT_HEADER = 'MANAGEMENT-USER-KEY';

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
  management: 'system-open-management',
  info: 'system-show-info',
  locale_it: 'system-locale-it',
  locale_en: 'system-locale-en'
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
  },
  info: {
    code: SYSTEM_MENU_CODE.info,
    icon: 'info',
    text: 'Show infos',
    logic: 'system',
  },
  locale_en: {
    code: SYSTEM_MENU_CODE.locale_en,
    icon: 'EN',
    textAsIcon: true,
    text: 'Switch to other language',
    logic: 'system',
  },
  locale_it: {
    code: SYSTEM_MENU_CODE.locale_it,
    icon: 'IT',
    textAsIcon: true,
    text: 'Passa ad altra lingua',
    logic: 'system',
  }
}

export const DAY: any = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}
export const MONTH: any = {
  0: 'january',
  1: 'february',
  2: 'march',
  3: 'april',
  4: 'may',
  5: 'june',
  6: 'july',
  7: 'august',
  8: 'september',
  9: 'october',
  10: 'november',
  11: 'december',
}
