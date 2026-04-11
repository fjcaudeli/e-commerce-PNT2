import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../Services/carritoService';
import { CarritoItem } from '../../models';

@Component({
  selector: 'app-carrito-component',
  standalone: false,
  templateUrl: './carrito-component.html',
  styleUrl: './carrito-component.css'
})
export class CarritoComponent implements OnInit {

  items: CarritoItem[] = [];
  error = '';

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.carritoService.GetItems().subscribe((items: CarritoItem[]) => {
      this.items = items;
    });
  }

  cambiarCantidad(item: CarritoItem, cantidad: string): void {
    this.error = '';
    const nuevaCantidad = Number(cantidad);

    this.carritoService.ModificarCantidad(item.producto.id, nuevaCantidad).subscribe({
      next: (items: CarritoItem[]) => {
        this.items = items;
      },
      error: (err: Error) => {
        this.error = err.message;
      }
    });
  }

  eliminar(productoId: number): void {
    this.error = '';

    this.carritoService.EliminarProducto(productoId).subscribe((items: CarritoItem[]) => {
      this.items = items;
    });
  }

  vaciar(): void {
    this.error = '';

    this.carritoService.VaciarCarrito().subscribe(() => {
      this.items = [];
    });
  }

  confirmarCompra(): void {
    if (this.items.length === 0) {
      this.error = 'El carrito esta vacio';
      return;
    }

    this.router.navigate(['/confirmar-compra']);
  }

  obtenerSubtotal(item: CarritoItem): number {
    return item.producto.precio * item.cantidad;
  }

  obtenerTotal(): number {
    return this.items.reduce((total, item) => total + this.obtenerSubtotal(item), 0);
  }
}
