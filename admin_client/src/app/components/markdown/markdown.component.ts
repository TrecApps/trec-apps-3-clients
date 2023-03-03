import { Component, OnInit } from '@angular/core';
import '@github/markdown-toolbar-element'
@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css'],
  inputs: ["text_area_id"]
})
export class MarkdownComponent implements OnInit {

  text_area_id: string|null = null;
  constructor() { }

  ngOnInit(): void {
  }

}
