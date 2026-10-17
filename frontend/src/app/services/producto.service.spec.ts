import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { Producto } from '../models/producto';

describe('ProductoService (Lab 09)', () => {
  let service: ProductoService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list products and parse response correctly', () => {
    const mock: Producto[] = [{ id: 1, nombre: 'Teclado', precio: 100, stock: 5 }];

    service.listar().subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpTesting.expectOne('http://localhost:8080/api/productos');
    req.flush(mock);
  });

  it('should map 404 error to controlled error message', () => {
    let capturedError = '';
    service.buscarPorId(999).subscribe({
      next: () => {},
      error: err => {
        capturedError = err.message;
      }
    });

    const req = httpTesting.expectOne('http://localhost:8080/api/productos/999');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    expect(capturedError).toBe('El recurso solicitado no existe.');
  });

  it('should map status 0 to connection error message', () => {
    let capturedError = '';
    service.listar().subscribe({
      next: () => {},
      error: err => {
        capturedError = err.message;
      }
    });

    const req = httpTesting.expectOne('http://localhost:8080/api/productos');
    req.error(new ProgressEvent('error'), { status: 0 });
    expect(capturedError).toBe('No se pudo conectar con la API.');
  });
});
