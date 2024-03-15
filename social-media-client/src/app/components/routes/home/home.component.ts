import { Component } from '@angular/core';
import { TopBarComponent } from '../../repeats/top-bar/top-bar.component';
import { PostEditComponent } from '../../repeats/post-edit/post-edit.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopBarComponent, PostEditComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
