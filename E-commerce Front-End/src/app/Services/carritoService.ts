import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { CarritoItem, Producto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private items: CarritoItem[] = [];
  private itemsSubject = new BehaviorSubject<CarritoItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  constructor() {}

  GetItems(): Observable<CarritoItem[]> {
    return of(this.copiarItems());
  }

  AgregarProducto(producto: Producto, cantidad: number = 1): Observable<CarritoItem[]> {
    if (cantidad <= 0) {
      return throwError(() => new Error('La cantidad debe ser mayor a cero'));
    }

    const itemExistente = this.items.find(item => item.producto.id === producto.id);
    const cantidadActual = itemExistente?.cantidad ?? 0;
    const nuevaCantidad = cantidadActual + cantidad;

    if (nuevaCantidad > producto.stock) {
      return throwError(() => new Error('No hay stock suficiente'));
    }

    if (itemExistente) {
      itemExistente.cantidad = nuevaCantidad;
    } else {
      this.items.push({ producto, cantidad });
    }

    this.notificarCambios();
    return of(this.copiarItems());
  }

  ModificarCantidad(productoId: number, cantidad: number): Observable<CarritoItem[]> {
    const item = this.items.find(x => x.producto.id === productoId);

    if (!item) {
      return throwError(() => new Error('El producto no esta en el carrito'));
    }

    if (cantidad <= 0) {
      return this.EliminarProducto(productoId);
    }

    if (cantidad > item.producto.stock) {
      return throwError(() => new Error('No hay stock suficiente'));
    }

    item.cantidad = cantidad;
    this.notificarCambios();

    return of(this.copiarItems());
  }

  EliminarProducto(productoId: number): Observable<CarritoItem[]> {
    this.items = this.items.filter(item => item.producto.id !== productoId);
    this.notificarCambios();

    return of(this.copiarItems());
  }

  VaciarCarrito(): Observable<void> {
    this.items = [];
    this.notificarCambios();

    return of(void 0);
  }

  ObtenerTotal(): number {
    return this.items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  ObtenerCantidadTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  private notificarCambios(): void {
    this.itemsSubject.next(this.copiarItems());
  }

  private copiarItems(): CarritoItem[] {
    return this.items.map(item => ({
      producto: { ...item.producto },
      cantidad: item.cantidad
    }));
  }
}
