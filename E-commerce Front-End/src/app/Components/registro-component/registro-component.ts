import { Component } from '@angular/core';
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
  clave = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar(): void {
    this.error = '';

    if (!this.nombreCompleto || !this.usuario || !this.clave) {
      this.error = 'Complete todos los campos';
      return;
    }

    this.authService.registrar({
      nombreCompleto: this.nombreCompleto,
      usuario: this.usuario,
      clave: this.clave
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        this.error = err.message;
      }
    });
  }
}
