import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SPORTBUS_MANAGER } from '@olmi/common';

@Component({
  selector: 'footer-toolbar',
  imports: [
    CommonModule,
    FlexModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './footer-toolbar.component.html',
  styleUrl: './footer-toolbar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterToolbarComponent {
  manager =  inject(SPORTBUS_MANAGER);
}
