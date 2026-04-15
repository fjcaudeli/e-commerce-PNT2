import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Services/authService';
import { CarritoService } from './Services/carritoService';
import { CarritoItem } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'carrito';
  cantidadCarrito = 0;

  constructor(
    public authService: AuthService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carritoService.items$.subscribe((items: CarritoItem[]) => {
      this.cantidadCarrito = items.reduce((total, item) => total + item.cantidad, 0);
    });
  }

  logout(): void {
    this.authService.logout();
    this.carritoService.LimpiarEstadoLocal();
    this.router.navigate(['/login']);
  }
}
