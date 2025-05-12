import { Component, inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { SPORTBUS_API, SPORTBUS_I18N, SPORTBUS_MANAGER, SPORTBUS_NOTIFIER, SPORTBUS_STATE } from '@olmi/common';
import { BehaviorSubject, filter, map, Observable, of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConfirmDialogUtility } from './confirm-dialog/confirm-dialog.component';
import { cloneDeep as _clone, extend as _extend, get as _get, set as _set } from 'lodash';

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

  readonly i18n = inject(SPORTBUS_I18N);
  readonly notifier = inject(SPORTBUS_NOTIFIER);
  readonly interaction = inject(SPORTBUS_API);
  readonly state = inject(SPORTBUS_STATE);
  readonly manager = inject(SPORTBUS_MANAGER);

  invalid$: Observable<boolean> = of(true);
  handleMenu = false;
  handleInfo = false;

  constructor() {
    this._destroy$ = new Subject<void>();
  }

  ngOnDestroy() {
    if (this.handleMenu) this.state.menuHandler = undefined;
    if (this.handleInfo) this.state.showInfo = undefined;
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

  testValue(e: any) {
    console.log('TEST VALUE CHANGED', e);
  }
}


@Component({
  standalone: true,
  selector: 'dialog-editor-base',
  template: '',
  imports: [
    CommonModule,
  ]
})
export class DialogEditorBase<T> extends EditorBase {
  private readonly _dialogRef = <MatDialogRef<DialogEditorBase<T>>>inject(MatDialogRef)
  value = <T>inject(MAT_DIALOG_DATA);
  value$: BehaviorSubject<T>;

  protected applyValue: (v: T) => void = (v: T) => {};
  protected validate: (v: T) => boolean = (v: T) => true;

  constructor() {
    super();
    this.value$ = new BehaviorSubject<T>(_clone(this.value));
    this.invalid$ = this.value$.pipe(map(v => !this.validate(v)));
  }

  protected clone(o: any) {
    return _clone(o);
  }
  protected extend(target: any, source: any) {
    return _extend(target, source);
  }

  protected updateValue(e: any, prp: string, path?: string) {
    const nv = _clone(this.value$.value);
    const v = path ? _get(e, path) : e;
    _set(<any>nv, prp, v);
    this.value$.next(nv);
  }

  apply() {
    this.applyValue(_clone(this.value$.value));
    this._dialogRef.close();
  }
}
