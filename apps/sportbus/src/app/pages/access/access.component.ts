import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { AppUserOptions } from '@olmi/common';
import { BUS_PREFIX, isRightCode, NotificationType, Session, SPORTBUS_USER_OPTIONS_FEATURE } from '@olmi/model';
import { SESSION_PAGE_ROUTE } from '../session/session.manifest';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject, catchError, map, Observable, of, take } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { EditorBase } from '@olmi/components';

@Component({
  imports: [
    CommonModule,
    FlexModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective
  ],
  selector: 'sportbus-access',
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessComponent extends EditorBase implements AfterViewInit {
  @ViewChild('codeInput') codeInput: ElementRef|undefined;
  opening$: BehaviorSubject<boolean>;
  code$: BehaviorSubject<string>;
  isInvalidCode$: Observable<boolean>;

  constructor() {
    super();
    this.code$ = new BehaviorSubject<string>('');
    this.opening$ = new BehaviorSubject<boolean>(false);

    this._checkUserSession();
    this.isInvalidCode$ = this.code$.pipe(map(code => !isRightCode(code)));
  }

  private _checkUserSession() {
    const o = AppUserOptions.getFeatures<any>(SPORTBUS_USER_OPTIONS_FEATURE);
    if (o.session) this._router.navigate([`${SESSION_PAGE_ROUTE}/${o.session}`]);
  }

  private _openSession(code: string) {
    this._router.navigate([`${SESSION_PAGE_ROUTE}/${code}`]);
  }

  ngAfterViewInit() {
    setTimeout(() => this.codeInput?.nativeElement.focus());1231
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.isInvalidCode$.pipe(take(1)).subscribe(notvalid => {
      if (!notvalid && event.key === 'Enter') this.login();
    });
  }

  keepText(e: any) {
    this.code$.next(e.target.value||'');
  }

  login() {
    this._openSession(this.code$.value);
  }

  create() {
    this.opening$.next(true);
    this.interaction.createSession()
      .pipe(catchError(err => {
        console.error(...BUS_PREFIX, 'error while create session', err);
        return of(undefined);
      }))
      .subscribe((s: Session|undefined) => s ?
        this._openSession(s.code) :
        this.notifier.notify('cannot create sesssion', NotificationType.error));
  }
}
