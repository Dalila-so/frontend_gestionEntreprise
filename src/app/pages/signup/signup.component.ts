/*import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [CommonModule, FormsModule]
})
export class SignupComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSignup() {
    this.auth.signup({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => (this.error = err.error?.message || 'Signup failed')
    });
  }
}*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSignup(form: NgForm) {
    this.errorMsg = '';
    this.successMsg = '';
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.auth.signup({ email: this.email.trim(), password: this.password.trim() })
      .subscribe({
        next: (res) => {
          this.auth.saveToken(res.token);
             this.router.navigate(['/dashboard']);

          // Optional: Navigate to dashboard
          // this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMsg = err.message || 'Signup failed';
          this.loading = false;
        }
      });
  }
}

