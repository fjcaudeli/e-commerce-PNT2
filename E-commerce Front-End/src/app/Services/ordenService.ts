import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { CarritoItem, ConfirmarOrdenRequest, ConfirmarOrdenResponse, Orden } from '../models';
import { CarritoService } from './carritoService';
import { ProductoService } from './productoService';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.ordenes}`;
  private ordenes: Orden[] = [];

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService,
    private productoService: ProductoService
  ) {}

  ConfirmarOrden(items: CarritoItem[], usuarioId?: number): Observable<ConfirmarOrdenResponse> {
    if (items.length === 0) {
      return throwError(() => new Error('El carrito esta vacio'));
    }

    if (!API_CONFIG.useMocks) {
      const request: ConfirmarOrdenRequest = {
        items: items.map(item => ({
          productoId: item.producto.id,
          cantidad: item.cantidad
        }))
      };

      return this.http.post<ConfirmarOrdenResponse>(this.apiUrl, request).pipe(
        tap(() => this.carritoService.VaciarCarrito().subscribe())
      );
    }

    const sinStock = items.some(item =>
      !this.productoService.HayStock(item.producto.id, item.cantidad)
    );

    if (sinStock) {
      return throwError(() => new Error('Hay productos sin stock suficiente'));
    }

    items.forEach(item => {
      this.productoService.ActualizarStock(item.producto.id, item.cantidad).subscribe();
    });

    const orden: Orden = {
      id: this.ordenes.length + 1,
      usuarioId,
      items: items.map(item => ({
        producto: { ...item.producto },
        cantidad: item.cantidad
      })),
      total: this.calcularTotal(items),
      fecha: new Date().toISOString(),
      estado: 'Confirmada'
    };

    this.ordenes.push(orden);
    this.carritoService.VaciarCarrito().subscribe();

    return of({
      orden,
      mensaje: 'Compra confirmada correctamente'
    });
  }

  GetOrdenes(): Observable<Orden[]> {
    if (!API_CONFIG.useMocks) {
      return this.http.get<Orden[]>(this.apiUrl);
    }

    return of([...this.ordenes]);
  }

  GetOrdenById(id: number): Observable<Orden | undefined> {
    if (!API_CONFIG.useMocks) {
      return this.http.get<Orden>(`${this.apiUrl}/${id}`);
    }

    return of(this.ordenes.find(orden => orden.id === id));
  }

  private calcularTotal(items: CarritoItem[]): number {
    return items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }
}
