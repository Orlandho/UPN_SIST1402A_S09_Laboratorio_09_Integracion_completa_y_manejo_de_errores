import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/productos';

  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensaje = 'Ocurrió un error inesperado.';

    if (error.status === 0) {
      mensaje = 'No se pudo conectar con la API.';
    } else if (error.status === 400) {
      mensaje = 'Los datos enviados no son válidos.';
    } else if (error.status === 404) {
      mensaje = 'El recurso solicitado no existe.';
    } else if (error.status === 500) {
      mensaje = 'Error interno del servidor.';
    }

    return throwError(() => new Error(mensaje));
  }

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl)
      .pipe(catchError(error => this.manejarError(error)));
  }

  buscarPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => this.manejarError(error)));
  }

  registrar(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto)
      .pipe(catchError(error => this.manejarError(error)));
  }

  actualizar(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto)
      .pipe(catchError(error => this.manejarError(error)));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => this.manejarError(error)));
  }

  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/buscar?nombre=${encodeURIComponent(nombre)}`)
      .pipe(catchError(error => this.manejarError(error)));
  }
}
