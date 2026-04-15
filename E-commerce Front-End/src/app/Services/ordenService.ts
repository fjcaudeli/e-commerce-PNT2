import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { CarritoItem, ConfirmarOrdenResponse, GeneralResponse, Orden, parseApiJson } from '../models';
import { CarritoService } from './carritoService';
import { AuthService } from './authService';

interface ApiSale {
  id: number;
  user_id: number;
  total: number;
  fecha?: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.compras}`;

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService,
    private authService: AuthService
  ) {}

  ConfirmarOrden(items: CarritoItem[], usuarioId?: number): Observable<ConfirmarOrdenResponse> {
    if (items.length === 0) {
      return throwError(() => new Error('El carrito esta vacio'));
    }

    const id = usuarioId ?? this.authService.getUsuarioActual()?.id;

    if (!id) {
      return throwError(() => new Error('Debe iniciar sesion'));
    }

    return this.http.post<GeneralResponse>(`${this.apiUrl}/Confirm/${id}`, null).pipe(
      map((response: GeneralResponse) => {
        if (!response.estado) {
          throw new Error(response.mensaje || 'No se pudo confirmar la compra');
        }

        const orden: Orden = {
          usuarioId: id,
          items: items.map(item => ({
            id: item.id,
            producto: { ...item.producto },
            cantidad: item.cantidad
          })),
          total: this.calcularTotal(items),
          fecha: new Date().toISOString(),
          estado: 'Confirmada'
        };

        return {
          orden,
          mensaje: response.mensaje
        };
      }),
      tap(() => this.carritoService.LimpiarEstadoLocal())
    );
  }

  GetOrdenes(): Observable<Orden[]> {
    const usuarioId = this.authService.getUsuarioActual()?.id;

    if (!usuarioId) {
      return throwError(() => new Error('Debe iniciar sesion'));
    }

    return this.http.get(`${this.apiUrl}/GetByUser/${usuarioId}`, { responseType: 'text' }).pipe(
      map(response => parseApiJson<ApiSale[]>(response).map(sale => this.mapOrden(sale)))
    );
  }

  GetOrdenById(id: number): Observable<Orden | undefined> {
    return this.GetOrdenes().pipe(
      map(ordenes => ordenes.find(orden => orden.id === id))
    );
  }

  private calcularTotal(items: CarritoItem[]): number {
    return items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  private mapOrden(sale: ApiSale): Orden {
    return {
      id: sale.id,
      usuarioId: sale.user_id,
      items: [],
      total: sale.total,
      fecha: sale.fecha ?? sale.date ?? '',
      estado: 'Confirmada'
    };
  }
}
