import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '@olmi/model';
import { EditorBase } from '../editor.base';
import { FlexModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'essential-toolbar',
  imports: [
    CommonModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    FlexModule
  ],
  template: `
    <div class="essential-toolbar" fxLayout="row" fxLayoutAlign="start center">
      <!-- MENU DI PAGINA -->
      @for (item of state.menu$|async; track $index) {
        @if (!item.hidden) {
          @if (item.separator) {
            <div class="separator-h"></div>
          } @else if (item.subMenu) {
            <button mat-icon-button
                    [matMenuTriggerFor]="pagesubmenu"
                    (click)="buildSubMenu(item)"
                    [matTooltip]="item.text||''"
                    [matTooltipDisabled]="!item.text"
                    aria-label="sub menu">
              <mat-icon [class.text-icon]="item.textAsIcon">{{item.icon}}</mat-icon>
            </button>
          } @else {
            @if (state.status$|async; as status) {
              <button mat-icon-button
                      [matTooltip]="item.text||''"
                      [matTooltipDisabled]="!item.text"
                      [disabled]="item.disabled"
                      [class.active]="item.active"
                      [ngClass]="'sdk-color-'+item.color"
                      (click)="state.handleMenuItem(item)">
                <mat-icon [class.text-icon]="item.textAsIcon">{{ item.icon }}</mat-icon>
              </button>
            }
          }
        }
      }
      <!-- MENU POPUP DI PAGINA -->
      <mat-menu #pagesubmenu="matMenu">
        @for (mitem of pageSubMenu$|async; track $index) {
          @if (!mitem.hidden) {
            @if (mitem.separator) {
              <div class="separator-v"></div>
            } @else {
              <button mat-menu-item
                      [disabled]="mitem.disabled"
                      [class.active]="mitem.active"
                      [class.route-active]="mitem.routeActive"
                      [ngClass]="'sdk-color-'+mitem.color"
                      (click)="state.handleMenuItem(mitem)">
                <mat-icon [class.text-icon]="mitem.textAsIcon">{{mitem.icon}}</mat-icon>
                <span>{{mitem.text}}</span>
              </button>
            }
          }
        }
      </mat-menu>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EssentialToolbarComponent extends EditorBase {
  pageSubMenu$: BehaviorSubject<MenuItem[]>;

  constructor() {
    super();
    this.pageSubMenu$ = new BehaviorSubject<MenuItem[]>([]);
  }

  buildSubMenu = (item: MenuItem) => this.pageSubMenu$.next(item.subMenu || []);
}
