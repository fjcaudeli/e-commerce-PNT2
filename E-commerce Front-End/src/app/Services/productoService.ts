import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.productos}`;

  private productos: Producto[] = [
    { id: 1, nombre: 'Teclado gamer', precio: 100, stock: 5, descripcion: 'Teclado mecánico con switches violetas' },
    { id: 2, nombre: 'Mouse gamer', precio: 50, stock: 8, descripcion: 'Mouse RGB con sensor óptico de última generación' },
    { id: 3, nombre: 'Auriculares gamer', precio: 80, stock: 3, descripcion: 'Auriculares gamer flama con micrófono incluido' },
    { id: 4, nombre: 'Monitor gamer', precio: 250, stock: 0, descripcion: 'Monitor curvo Full HD 27 pulgadas 144Hz' }
  ];

  constructor(private http: HttpClient) {}

  GetProductos(): Observable<Producto[]> {
    if (!API_CONFIG.useMocks) {
      return this.http.get<Producto[]>(this.apiUrl);
    }

    return of([...this.productos]);
  }

  GetProductoById(id: number): Observable<Producto | undefined> {
    if (!API_CONFIG.useMocks) {
      return this.http.get<Producto>(`${this.apiUrl}/${id}`);
    }

    return of(this.productos.find(producto => producto.id === id));
  }

  ActualizarStock(productoId: number, cantidadComprada: number): Observable<boolean> {
    if (!API_CONFIG.useMocks) {
      return this.http.patch<boolean>(`${this.apiUrl}/${productoId}/stock`, { cantidadComprada });
    }

    const producto = this.productos.find(x => x.id === productoId);

    if (!producto || producto.stock < cantidadComprada) {
      return of(false);
    }

    producto.stock -= cantidadComprada;
    return of(true);
  }

  HayStock(productoId: number, cantidad: number): boolean {
    if (!API_CONFIG.useMocks) {
      return true;
    }

    const producto = this.productos.find(x => x.id === productoId);
    return !!producto && producto.stock >= cantidad;
  }
}
