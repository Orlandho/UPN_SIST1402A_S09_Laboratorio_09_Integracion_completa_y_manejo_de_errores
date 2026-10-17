# UPN SIST1402A - Laboratorio 09: Integración completa y manejo de errores Angular + Spring Boot

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-19%20%2F%2022-dd0031.svg?logo=angular)](https://angular.dev/)
[![Java](https://img.shields.io/badge/Java-17%20LTS-orange.svg?logo=openjdk)](https://openjdk.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Build & Tests](https://img.shields.io/badge/Tests-100%25%20Passing-success.svg)]()
[![Architecture](https://img.shields.io/badge/Diagram-Draw.io-blue.svg?logo=diagramsdotnet)](./diagramas/flujo-formulario-notificar.drawio)

Repositorio oficial y solución de nivel profesional para el **Laboratorio 09** del curso **Soluciones Web y Aplicaciones Distribuidas** (`SIST1402A`), Universidad Privada del Norte (UPN, Periodo 2026-2).

---

## 🎯 Objetivo y Logro de la Práctica
Desarrollar, integrar y validar un sistema distribuido completo entre una **Single Page Application (SPA) en Angular** y una **API RESTful en Spring Boot**, implementando el flujo reactivo institucional:

$$\mathbf{Formulario} \longrightarrow \mathbf{Validar} \longrightarrow \mathbf{Enviar} \longrightarrow \mathbf{Persistir} \longrightarrow \mathbf{Notificar}$$

### Contrato Base Institucional
La capa de presentación implementa fielmente la suscripción reactiva requerida:
```typescript
this.servicio.crear(producto).subscribe({
  next: () => this.mensaje = "Guardado",
  error: () => this.mensaje = "Revise los datos"
});
```

---

## 📐 Diagrama de Arquitectura
El flujo E2E desde el formulario reactivo hasta la persistencia y notificación al usuario se encuentra modelado en el archivo nativo editable de Draw.io:
* 📄 **Ruta:** [`diagramas/flujo-formulario-notificar.drawio`](./diagramas/flujo-formulario-notificar.drawio)
* *(Compatible para apertura y edición directa en VS Code via la extensión "Draw.io Integration" o en app.diagrams.net).*

---

## 🚀 Arquitectura Técnica y Stack

### Backend (`/backend`)
* **Framework:** Spring Boot 3.3.4 / Spring Framework 6.
* **Lenguaje:** Java 17 LTS.
* **Persistencia:** Spring Data JPA + Hibernate ORM.
* **Bases de Datos:**
  * **H2 In-Memory (MySQL Mode):** `jdbc:h2:mem:productosdb;MODE=MySQL` con seed automatizado (`data.sql`) para evaluación inmediata sin dependencias externas.
  * **MySQL listo para producción:** Perfil configurable en `application.properties`.
* **CORS:** Configuración global (`CorsConfig.java`) para consumo seguro desde `http://localhost:4200`.
* **Validación:** Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@PositiveOrZero`).
* **Pruebas Automatizadas:** Spring Boot Test + MockMvc (100% aprobado).

### Frontend (`/frontend`)
* **Framework:** Angular 19.2.1 / 22.x (Arquitectura moderna con componentes Standalone y Signals).
* **Formularios:** `ReactiveFormsModule` con validación sincrónica reactiva en tiempo real.
* **Comunicación HTTP:** `HttpClient` con tipado estricto `Producto` y operadores reactivos `RxJS` (`catchError`, `throwError`).
* **Manejo de Errores Centralizado:** Clasificación de fallas por código HTTP (`0`, `400`, `404`, `500`).
* **Pruebas Automatizadas:** Vitest / Angular CLI Test Runner (100% aprobado).

---

## 💻 Instrucciones de Ejecución Local

Para reproducir la integración, levante ambos entornos en terminales paralelas:

### 1. Backend (Spring Boot)
```powershell
cd backend
mvn clean test
mvn spring-boot:run
```
* API activa en: `http://localhost:8080/api/productos`
* Consola H2 activa en: `http://localhost:8080/h2-console`

### 2. Frontend (Angular)
```powershell
cd frontend
npm test -- --watch=false
npm run build
npm start
# O alternativamente: ng serve --open
```
* SPA disponible en el navegador: `http://localhost:4200/`

---

## 🧪 Matriz de Validación de Pruebas

```
========================================================================
SUITE DE PRUEBAS AUTOMATIZADAS
========================================================================
[BACKEND]  ProductoControllerTest (MockMvc)
  ✔ Debe listar todos los productos con HTTP 200 OK
  ✔ Debe retornar un producto por ID existente con HTTP 200 OK
  ✔ Debe retornar HTTP 404 Not Found cuando el ID no existe
  ✔ Debe crear un producto válido con HTTP 201 Created
  TOTAL BACKEND: 4/4 PASARON (100%)

[FRONTEND] Angular Standalone Tests (Vitest)
  ✔ ProductoService debe crearse e inyectarse correctamente
  ✔ ProductoService debe invocar GET /api/productos
  ✔ ProductoService debe invocar POST /api/productos
  ✔ ProductoFormComponent debe inicializar con formulario vacío
  ✔ ProductoFormComponent debe validar campos obligatorios
  TOTAL FRONTEND: 5/5 PASARON (100%)
========================================================================
```

---

## 📑 Informe de Laboratorio
El análisis detallado con respuestas a las preguntas de ingeniería requeridas por la guía docente se encuentra documentado en:
* 📄 [`INFORME_LABORATORIO_09.md`](./INFORME_LABORATORIO_09.md)
  * Análisis de errores en Frontend vs Backend.
  * Metodología de documentación de pruebas End-to-End.
  * Análisis crítico sobre capturas y evidencias insuficientes.
  * Conclusiones técnicas de la arquitectura distribuida.

---

## 👤 Autor
* **Orlando Dorival** — Estudiante de Ingeniería de Sistemas Computacionales
* **Universidad Privada del Norte (UPN)** — 2026-2
