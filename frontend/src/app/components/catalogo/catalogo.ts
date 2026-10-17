import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss'
})
export class Catalogo implements OnInit {
  private productoService = inject(ProductoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productos = signal<Producto[]>([]);
  cargando = signal(false);
  error = signal('');
  criterio = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) {
        this.criterio = q;
        this.ejecutarBusqueda(q);
      } else {
        this.cargarProductos();
      }
    });
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.error.set('');
    this.productoService.listar().subscribe({
      next: datos => {
        this.productos.set(datos);
        this.cargando.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.cargando.set(false);
      }
    });
  }

  buscar(): void {
    const texto = this.criterio.trim();
    this.router.navigate(['/productos'], {
      queryParams: { q: texto || null }
    });

    if (!texto) {
      this.cargarProductos();
      return;
    }
    this.ejecutarBusqueda(texto);
  }

  private ejecutarBusqueda(texto: string): void {
    this.cargando.set(true);
    this.error.set('');

    this.productoService.buscarPorNombre(texto).subscribe({
      next: datos => {
        this.productos.set(datos);
        this.cargando.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.cargando.set(false);
      }
    });
  }

  limpiar(): void {
    this.criterio = '';
    this.router.navigate(['/productos'], { queryParams: {} });
    this.cargarProductos();
  }

  eliminar(id?: number): void {
    if (!id || !confirm('¿Desea eliminar este producto?')) return;
    this.cargando.set(true);
    this.productoService.eliminar(id).subscribe({
      next: () => this.cargarProductos(),
      error: err => {
        this.error.set(err.message);
        this.cargando.set(false);
      }
    });
  }
}
