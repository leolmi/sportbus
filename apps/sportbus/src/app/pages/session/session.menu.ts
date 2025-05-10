import { ButtonsStatus, MenuItem, SYSTEM_MENU_ITEMS } from '@olmi/model';

export const MENU_CODE: any = {
  settings: 'session-settings',
  share: 'session-share',
  logout: 'session-logout',
  shuttles: 'session-shuttles',
}

export const MAIN = <MenuItem[]>[
  SYSTEM_MENU_ITEMS.locale_it,
  SYSTEM_MENU_ITEMS.locale_en,
  SYSTEM_MENU_ITEMS.lightTheme,
  SYSTEM_MENU_ITEMS.darkTheme,
];


export const NARROW = <MenuItem[]>[
  {
    code: 'session-narrow-menu',
    icon: 'more_vert',
    subMenu: MAIN
  }
]

export const calcSessionMenuStatus = (): ButtonsStatus => {
  return <ButtonsStatus>{
    hidden: {

    }
  }
}
