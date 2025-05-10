import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MainToolbarComponent } from '@olmi/components';
import { SPORTBUS_STATE } from '@olmi/common';
import { Title } from '@angular/platform-browser';
import { SPORTBUS_TITLE } from '@olmi/model';
import { filter, take } from 'rxjs';


@Component({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
  ],
  selector: 'app-root',
  templateUrl: '/app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  state = inject(SPORTBUS_STATE);
  title = inject(Title);

  constructor() {
    this.state.info$.subscribe(i =>
      this.title.setTitle(i.title||SPORTBUS_TITLE));
  }
}
