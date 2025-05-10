import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SPORTBUS_I18N, SPORTBUS_MANAGER } from '@olmi/common';
import { FlexModule } from '@angular/flex-layout';
import { map, Observable } from 'rxjs';
import { DAY, isTheSameDay, MONTH } from '@olmi/model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'session-header',
  imports: [
    CommonModule,
    FlexModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './session-header.component.html',
  styleUrl: './session-header.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionHeaderComponent {
  readonly manager = inject(SPORTBUS_MANAGER);
  readonly i18n = inject(SPORTBUS_I18N);
  readonly realToday: Date;

  day$: Observable<string>;
  dayNum$: Observable<string>;
  month$: Observable<string>;
  year$: Observable<string>;
  isToday$: Observable<boolean>;

  constructor() {
    this.realToday = new Date();
    this.day$ = this.manager.date$.pipe(map(d => this.i18n.localize(`${DAY[d.getDay()]}`)));
    this.dayNum$ = this.manager.date$.pipe(map(d => `${d.getDate()}`));
    this.month$ = this.manager.date$.pipe(map(d => this.i18n.localize(`${MONTH[d.getMonth()]}`)));
    this.year$ = this.manager.date$.pipe(map(d => `${d.getFullYear()}`));

    this.isToday$ = this.manager.date$.pipe(map(d => isTheSameDay(this.realToday, d)));
  }

  private _moveDate(delta = 1) {
    const d = this.manager.date$.value;
    d.setDate(d.getDate() + delta);
    this.manager.setDate(d);
  }

  setDate(e: any) {
    this.manager.setDate(e.value);
  }

  prev() {
    this._moveDate(-1);
  }

  next() {
    this._moveDate();
  }

  today() {
    this.manager.setDate(this.realToday);
  }

}
