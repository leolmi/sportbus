import { inject, InjectionToken } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationType } from '@olmi/model';
import { SPORTBUS_I18N } from './i18n';

export class Notifier {
  private readonly _snack = inject(MatSnackBar);
  private readonly _i18n = inject(SPORTBUS_I18N);

  /**
   * mostra la notifica
   * @param message
   * @param type
   * @param o
   */
  notify(message: string, type = NotificationType.info, o?: Partial<MatSnackBarConfig>) {
    this._snack.open(this._i18n.localize(message), '', {
      ...o,
      duration: o?.duration||3000,
      panelClass: o?.panelClass||`type-${type}`
    })
  }
}

export const SPORTBUS_NOTIFIER = new InjectionToken<Notifier>('SPORTBUS_NOTIFIER');
