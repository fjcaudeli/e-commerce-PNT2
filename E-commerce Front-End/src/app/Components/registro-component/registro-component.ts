import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/authService';

@Component({
  selector: 'app-registro-component',
  standalone: false,
  templateUrl: './registro-component.html',
  styleUrl: './registro-component.css'
})
export class RegistroComponent {

  nombreCompleto = '';
  usuario = '';
  email = '';
  clave = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  registrar(): void {
    this.error = '';

    if (!this.nombreCompleto || !this.usuario || !this.email || !this.clave) {
      this.error = 'Complete todos los campos';
      return;
    }

    this.authService.registrar({
      nombreCompleto: this.nombreCompleto,
      usuario: this.usuario,
      email: this.email,
      clave: this.clave
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        this.error = err.message;
        this.cdr.detectChanges();
      }
    });
  }
}
