import { CommonModule } from '@angular/common';
import { Component, Output, Input, EventEmitter } from '@angular/core';

export class MenuData {
  caption: string;
  funcIndex: number;

  constructor(caption: string, funcIndex: number) {
    this.caption = caption;
    this.funcIndex = funcIndex;
  }
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css'
})
export class ContextMenuComponent {
  @Input()
  menuItems: MenuData[] = [];

  @Output()
  onSelected = new EventEmitter<MenuData>();
}
