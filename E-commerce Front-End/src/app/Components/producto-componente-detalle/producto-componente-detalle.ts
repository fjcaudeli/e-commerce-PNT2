import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../Services/productoService';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../Services/carritoService';
import { CarritoItem } from '../../models';

@Component({
  selector: 'app-producto-componente-detalle',
  standalone: false,
  templateUrl: './producto-componente-detalle.html',
  styleUrl: './producto-componente-detalle.css'
})
export class ProductoComponenteDetalle implements OnInit {

  producto?: Producto;
  cantidad = 1;
  cantidadActualEnCarrito = 0;
  mensaje = '';
  error = '';
  private mensajeTimer?: ReturnType<typeof setTimeout>;
  private errorTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.GetProducto(id);
    this.carritoService.GetItems().subscribe({ error: () => undefined });
    this.carritoService.items$.subscribe((items: CarritoItem[]) => {
      this.cantidadActualEnCarrito = this.obtenerCantidadEnCarrito(items, id);
      this.cdr.detectChanges();
    });
  }

  GetProducto(id: number){
    this.productoService.GetProductoById(id)
      .subscribe((res: Producto | undefined) => {
        this.producto = res;
      });
  }

  agregarAlCarrito(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.producto) {
      this.error = 'Producto no encontrado';
      return;
    }

    this.carritoService.AgregarProducto(this.producto, this.cantidad).subscribe({
      next: () => {
        this.mostrarMensaje('Producto agregado al carrito');
      },
      error: (err: Error) => {
        this.mostrarError(err.message);
      }
    });
  }

  private mostrarMensaje(texto: string): void {
    if (this.mensajeTimer) {
      clearTimeout(this.mensajeTimer);
    }

    this.mensaje = '';
    this.cdr.detectChanges();

    this.mensajeTimer = setTimeout(() => {
      this.mensaje = texto;
      this.cdr.detectChanges();
    }, 80);
  }

  private mostrarError(texto: string): void {
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
    }

    this.error = '';
    this.cdr.detectChanges();

    this.errorTimer = setTimeout(() => {
      this.error = texto;
      this.cdr.detectChanges();
    }, 80);
  }

  private obtenerCantidadEnCarrito(items: CarritoItem[], productoId: number): number {
    return items.find(item => item.producto.id === productoId)?.cantidad ?? 0;
  }
}
