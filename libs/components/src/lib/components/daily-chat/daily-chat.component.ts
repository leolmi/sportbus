import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase } from '../editor.base';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Message, SessionOnDay } from '@olmi/model';
import { IAmPipe, MessageDateTimePipe, MessageOwnerPipe } from '../pipes';
import { slice as _slice } from 'lodash';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


const TOP_STEP = 10;

@Component({
  selector: 'daily-chat',
  imports: [
    CommonModule,
    FlexModule,
    MessageDateTimePipe,
    MessageOwnerPipe,
    MatIconButton,
    MatIcon,
    IAmPipe
  ],
  templateUrl: './daily-chat.component.html',
  styleUrl: './daily-chat.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyChatComponent extends EditorBase {
  messages$: Observable<Message[]>;
  top$: BehaviorSubject<number>;
  total$: BehaviorSubject<number>;
  incrementable$: Observable<boolean>;

  constructor() {
    super();

    this.top$ = new BehaviorSubject<number>(TOP_STEP);
    this.total$ = new BehaviorSubject<number>(0);
    this.messages$ = combineLatest([this.manager.sessionOnDay$, this.top$])
      .pipe(map(([sod, top]: [SessionOnDay | undefined, number]) => {
        const list = [...sod?.messages || []].reverse();
        this.total$.next(list.length);
        return _slice(list, 0, top);
      }));
    this.incrementable$ = combineLatest([this.total$, this.top$])
      .pipe(map(([tot, top]) => top < tot));
  }

  incrementTop() {
    this.top$.next(this.top$.value+TOP_STEP);
  }
}
