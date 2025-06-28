import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';


@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class LayoutComponent {
  constructor(private auth: AuthService, private router: Router) {}

  /** Called when user clicks “Déconnexion” */
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
