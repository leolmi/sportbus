import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import {
  calcShuttles,
  EditorBase,
  IsReadyDirectionPipe,
  mergeShuttles,
  ShuttleEditorComponent,
  ShuttleTypePipe
} from '@olmi/components';
import { combineLatest, map, Observable } from 'rxjs';
import { CalendarItem, SessionContext, Shuttle } from '@olmi/model';
import { I18nDirective } from '@olmi/common';
import KEYS from '../../../../../../resources.keys';

@Component({
  selector: 'shuttles-editor',
  imports: [
    CommonModule,
    FlexModule,
    ShuttleEditorComponent,
    IsReadyDirectionPipe,
    ShuttleTypePipe,
    I18nDirective
  ],
  templateUrl: './shuttles-editor.component.html',
  styleUrl: './shuttles-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShuttlesEditorComponent extends EditorBase {
  protected readonly KEYS = KEYS;

  shuttles$: Observable<Shuttle[]>;
  shuttlesLayout$: Observable<string>;
  needShuttles$: Observable<boolean>;

  constructor() {
    super();

    this.shuttles$ = combineLatest([this.manager.context$, this.manager.dayCalendarItems$])
      .pipe(map(([ctx, items]: [SessionContext, CalendarItem[]]) => {
        // calculated shuttles
        const cs = calcShuttles(ctx, items);
        return mergeShuttles(ctx.sod?.shuttles || [], cs);
      }));

    this.shuttlesLayout$ = this.state.layout$.pipe(map(l => l.compact ? 'column' : 'row'));

    this.needShuttles$ = this.shuttles$.pipe(map(ss => ss.length>0));
  }
}
