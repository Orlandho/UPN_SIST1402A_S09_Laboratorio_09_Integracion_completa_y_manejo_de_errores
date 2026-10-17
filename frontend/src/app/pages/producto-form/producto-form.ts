import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.scss'
})
export class ProductoForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);

  id?: number;
  editando = false;
  guardando = false;
  mensaje = '';

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    const valor = this.route.snapshot.paramMap.get('id');
    if (valor) {
      this.id = Number(valor);
      this.editando = true;
      this.productoService.buscarPorId(this.id).subscribe({
        next: (p: Producto) => {
          this.form.patchValue({
            nombre: p.nombre,
            precio: p.precio,
            stock: p.stock
          });
        },
        error: err => {
          this.mensaje = err.message || 'Error al cargar';
        }
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje = 'Revise los datos';
      return;
    }

    this.guardando = true;
    this.mensaje = '';

    const producto = this.form.getRawValue();

    const peticion = this.editando && this.id
      ? this.productoService.actualizar(this.id, producto)
      : this.productoService.registrar(producto);

    // Contrato base UPN SIST1402A: Formulario -> Validar -> Enviar -> Persistir -> Notificar
    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Guardado';
        setTimeout(() => this.router.navigate(['/productos']), 700);
      },
      error: err => {
        this.guardando = false;
        this.mensaje = err.message || 'Revise los datos';
      }
    });
  }
}
