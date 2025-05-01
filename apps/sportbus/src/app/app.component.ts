import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SPORTBUS_MANAGER, SPORTBUS_STATE } from '@olmi/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';
import { MenuItem, SPORTBUS_AUTHOR_LINK } from '@olmi/model';


@Component({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,

  ],
  selector: 'app-root',
  templateUrl: '/app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  state = inject(SPORTBUS_STATE);
  //manager = inject(SPORTBUS_MANAGER);

  pageSubMenu$: BehaviorSubject<MenuItem[]>;

  constructor() {
    this.pageSubMenu$ = new BehaviorSubject<MenuItem[]>([]);

    // this.manager.session$.pipe(
    //   distinctUntilChanged(),
    //   filter(s => !s))
    //   .subscribe(() => this.state.goAccess())
  }

  clickOnLogo = () => window.open(SPORTBUS_AUTHOR_LINK, "_blank");
  buildSubMenu = (item: MenuItem) => this.pageSubMenu$.next(item.subMenu || []);
}
