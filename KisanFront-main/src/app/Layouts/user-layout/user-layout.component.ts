import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterLink,RouterOutlet, FooterComponent],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

constructor(private router: Router) {}

@HostListener('document:keydown', ['$event'])
handleShortcut(event: KeyboardEvent) {
  console.log(event);

  if (event.altKey) {
    const key = event.key.toLowerCase();

    if (key === 'a') {
      this.router.navigate(['/admin/login']);
    } 
    else if (key === 'f') {
      this.router.navigate(['/farmer/login']);
    }
  }
}
darkMode = false;

toggleDarkMode() {
  this.darkMode = !this.darkMode;

  if (this.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

}
