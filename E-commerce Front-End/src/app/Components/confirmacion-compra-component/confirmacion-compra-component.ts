import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/authService';
import { CarritoService } from '../../Services/carritoService';
import { OrdenService } from '../../Services/ordenService';
import { CarritoItem, Orden } from '../../models';

@Component({
  selector: 'app-confirmacion-compra-component',
  standalone: false,
  templateUrl: './confirmacion-compra-component.html',
  styleUrl: './confirmacion-compra-component.css'
})
export class ConfirmacionCompraComponent implements OnInit {

  items: CarritoItem[] = [];
  orden?: Orden;
  error = '';

  constructor(
    private carritoService: CarritoService,
    private ordenService: OrdenService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carritoService.GetItems().subscribe((items: CarritoItem[]) => {
      this.items = items;
      this.cdr.detectChanges();
    });
  }

  confirmar(): void {
    this.error = '';
    const usuarioId = this.authService.getUsuarioActual()?.id;

    this.ordenService.ConfirmarOrden(this.items, usuarioId).subscribe({
      next: (response) => {
        this.orden = response.orden;
        this.items = [];
        this.cdr.detectChanges();
      },
      error: (err: Error) => {
        this.error = err.message;
        this.cdr.detectChanges();
      }
    });
  }

  volverAProductos(): void {
    this.router.navigate(['/productos']);
  }

  obtenerSubtotal(item: CarritoItem): number {
    return item.producto.precio * item.cantidad;
  }

  obtenerTotal(): number {
    return this.items.reduce((total, item) => total + this.obtenerSubtotal(item), 0);
  }
}
