import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/authService';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {

  usuario: string = '';
  clave: string = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {
    this.error = '';

    if (!this.usuario || !this.clave) {
      this.error = 'Ingrese usuario y clave';
      return;
    }

    this.authService.login(this.usuario, this.clave)
      .subscribe({
        next: () => {
          this.router.navigate(['/productos']); 
        },
        error: (err: Error) => {
          this.error = err.message;
          this.cdr.detectChanges();
        }
      });
  }
}

