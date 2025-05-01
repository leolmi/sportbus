import { Component, inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { SPORTBUS_API, SPORTBUS_MANAGER, SPORTBUS_NOTIFIER, SPORTBUS_STATE } from '@olmi/common';
import { filter, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConfirmDialogUtility } from './confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  selector: 'editor-base',
  template: '',
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule,
  ]
})
export class EditorBase implements OnDestroy {
  protected readonly _dialog = inject(MatDialog);
  protected readonly _router = inject(Router);
  protected readonly _destroy$: Subject<void>;
  protected readonly _confirm = inject(ConfirmDialogUtility);

  readonly notifier = inject(SPORTBUS_NOTIFIER);
  readonly interaction = inject(SPORTBUS_API);
  readonly state = inject(SPORTBUS_STATE);
  readonly manager = inject(SPORTBUS_MANAGER);

  constructor() {
    this._destroy$ = new Subject<void>();
  }

  ngOnDestroy() {
    // this.state.menuHandler = undefined;
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  protected openDialog<T>(component: any, handler: (res: T) => void, data?: MatDialogConfig) {
    this._dialog
      .open(component, data)
      .afterClosed()
      .pipe(filter(r => !!r))
      .subscribe(r => handler(<T>r));
  }
}
