import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import {
  ActiveDirectionsPipe,
  EditorBase,
  getPassengersMap,
  GroupNamePipe,
  IsSodNotUsedPassengerPipe,
  PersonEditorComponent
} from '@olmi/components';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { combineLatest, map, Observable } from 'rxjs';
import { Person, Session, SessionOnDay } from '@olmi/model';
import { has as _has, remove as _remove, sortBy as _sortBy } from 'lodash';
import { I18nPipe } from '@olmi/common';


@Component({
  selector: 'persons-editor',
  imports: [
    CommonModule,
    FlexModule,
    ActiveDirectionsPipe,
    GroupNamePipe,
    MatIcon,
    MatTooltip,
    IsSodNotUsedPassengerPipe,
    I18nPipe
  ],
  templateUrl: './persons-editor.component.html',
  styleUrl: './persons-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonsEditorComponent extends EditorBase {
  passengers$: Observable<Person[]>;
  passengersMap$: Observable<any>;
  sodDrivers$: Observable<Person[]>;

  UNKNOWN_ICON = 'question_mark';
  ICON_BY_CODE: any = {
    a: 'do_disturb',
    p: 'check'
  }
  ICON_BY_DIRECTIONS: any = {
    A: 'east',
    R: 'west',
    AR: 'sync_alt'
  }

  constructor() {
    super();
    this.passengers$ = combineLatest([this.manager.session$, this.manager.sessionOnDay$])
      .pipe(map(([ses, sod]: [Session|undefined, SessionOnDay|undefined]) => {
        const prss = [
          ...(ses?.persons || []).filter(p => !p.isDriver || !!p.group),
          ...(sod?.persons || []).filter(p => !p.isDriver || !!p.group)
        ];
        return _sortBy(prss, ['name']);
      }));
    this.sodDrivers$ = this.manager.sessionOnDay$.pipe(map(sod =>
      (sod?.persons||[]).filter(p => p.isDriver)));
    this.passengersMap$ = this.manager.sessionOnDay$.pipe(map(sod =>
      getPassengersMap(sod)));
  }

  togglePassenger(prs: Person) {
    this.manager.updateSessionOnDay((sod) => {
      sod.passengersMap = sod.passengersMap || {};
      if (!_has(sod.passengersMap, prs.code)) {
        sod.passengersMap[prs.code] = true;
      } else {
        const isp = !!(sod.passengersMap || {})[prs.code];
        if (isp) {
          sod.passengersMap[prs.code] = false;
        } else {
          delete sod.passengersMap[prs.code];
        }
      }
      return true;
    });
  }

  addPassenger() {
    this._dialog.open(PersonEditorComponent, { data: new Person() });
  }

  removeSodPerson(prs: Person) {
    this.manager.updateSessionOnDay((sod) =>
      _remove(sod.persons, (p) => p.code === prs.code).length > 0);
  }
}
