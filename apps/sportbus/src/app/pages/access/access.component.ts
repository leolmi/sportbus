import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { AppUserOptions, I18nDirective } from '@olmi/common';
import {
  BUS_PREFIX,
  isRightCode,
  NotificationType,
  sanitizeCode,
  Session,
  SPORTBUS_TITLE,
  SPORTBUS_USER_OPTIONS_FEATURE
} from '@olmi/model';
import { SESSION_PAGE_ROUTE } from '../session/session.manifest';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject, catchError, filter, map, Observable, of, take } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { EditorBase, EssentialToolbarComponent, InfoDialogComponent, InfoDialogOptions } from '@olmi/components';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogConfig } from '@angular/material/dialog';
import { MANAGEMENT_PAGE_ROUTE } from '../management/management.manifest';

@Component({
  imports: [
    CommonModule,
    FlexModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgxMaskDirective,
    EssentialToolbarComponent,
    I18nDirective,
  ],
  selector: 'sportbus-access',
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessComponent extends EditorBase implements AfterViewInit {
  protected readonly SPORTBUS_TITLE = SPORTBUS_TITLE;

  @ViewChild('codeInput') codeInput: ElementRef|undefined;
  opening$: BehaviorSubject<boolean>;
  code$: BehaviorSubject<string>;
  isInvalidCode$: Observable<boolean>;
  title$: Observable<string>;

  constructor() {
    super();
    this.handleMenu = true;
    this.handleInfo = true;
    this.code$ = new BehaviorSubject<string>('');
    this.opening$ = new BehaviorSubject<boolean>(false);

    this._checkUserSession();
    this.isInvalidCode$ = this.code$.pipe(map(code => !isRightCode(code)));
    this.title$ = this.state.info$.pipe(map(i => i?.title||''));
    this.state.showInfo = () => this._showInfo();
  }

  private _showInfo(data?: InfoDialogOptions) {
    this._dialog.open(InfoDialogComponent, <MatDialogConfig>{ data }).afterClosed().subscribe();
  }

  private _checkUserSession() {
    const o = AppUserOptions.getFeatures<any>(SPORTBUS_USER_OPTIONS_FEATURE);
    if (o.session) this._openSession(o.session);
  }

  private _openSession(code: string) {
    this._router.navigate([`${SESSION_PAGE_ROUTE}/${sanitizeCode(code)}`]);
  }

  ngAfterViewInit() {
    setTimeout(() => this.codeInput?.nativeElement.focus());

    this.state.firstAccess$
      .pipe(filter(fa => fa), take(1))
      .subscribe(() => this._showInfo({
        showWelcome: true,
        title: "Welcome!"
      }));
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

  openManagement() {
    this._router.navigate([MANAGEMENT_PAGE_ROUTE]);
  }
}
