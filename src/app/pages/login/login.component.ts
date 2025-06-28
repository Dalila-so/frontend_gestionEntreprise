/*import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]   // 👈 add FormsModule (and CommonModule if missing)
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  constructor(private authService: AuthService, private router: Router) {}
   onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMsg = 'Invalid email or password';
      }
    });
  }
}*/
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector   : 'app-login',
  templateUrl: './login.component.html',
  styleUrls  : ['./login.component.css'],
  imports    : [CommonModule, FormsModule]
})
export class LoginComponent {
  email     = '';
  password  = '';
  errorMsg  = '';
  loading   = false;
  successMsg= '';

  constructor(private auth: AuthService, private router: Router) {}

  /** Handle form submit */
  onLogin(form: NgForm) {
    this.errorMsg   = '';
    this.successMsg = '';

    const email    = this.email.trim();
    const password = this.password.trim();
    if (!email || !password) {
      this.errorMsg = 'Veuillez saisir votre email et mot de passe.';
      return;
    }

    this.loading = true;
    this.auth.login({ email, password }).subscribe({
      next: res => {
        this.auth.saveToken(res.token);
          this.router.navigate(['/dashboard']);   // <= instant access
     
  
      },
      error: () => {
        this.errorMsg = 'Email ou mot de passe incorrect';
        this.loading  = false;
      }
    });
  }
}
