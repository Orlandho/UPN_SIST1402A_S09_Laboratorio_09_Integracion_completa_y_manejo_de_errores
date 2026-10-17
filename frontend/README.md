# Laboratorio 09A - Repaso Guiado: Codespaces, Angular, Rutas, Formularios y Datos Mock

[![Angular](https://img.shields.io/badge/Angular-19%2B%20%2F%2022-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)]()
[![UPN](https://img.shields.io/badge/UPN-2026--2-blue?style=for-the-badge)]()

> **Curso:** Soluciones Web y Aplicaciones Distribuidas (SIST1402A)  
> **Estudiante:** Orlando Dorival  
> **Universidad:** Universidad Privada del Norte (UPN)  
> **Semana:** 9A  

---

## 🎯 1. Propósito y Logro del Laboratorio

Desarrollar una aplicación frontend moderna (Single Page Application - SPA) con **Angular**, aplicando componentes standalone, manejo reactivo del estado con **Angular Signals**, navegación modular con **Angular Router**, validación robusta de formularios mediante **Reactive Forms (`FormBuilder`)** y simulación desacoplada de persistencia mediante un **Servicio Mock asíncrono con RxJS (`Observable` y `of`)**.

Este laboratorio sienta la base frontend limpia y desacoplada antes de conectarse a la API REST de Spring Boot en el Laboratorio 09B.

---

## 🏗️ 2. Arquitectura de la Solución

El diagrama de arquitectura fue modelado en **Draw.io** y está disponible en [`diagramas/arquitectura-lab09a.drawio`](diagramas/arquitectura-lab09a.drawio).

```
Navegador Web (SPA :4200)
    │
    ▼
Angular Router (app.routes.ts)
    ├── /productos ───────────────► CatalogoComponent (Signals + Standalone)
    ├── /productos/nuevo ─────────► ProductoFormComponent (Reactive Forms)
    └── /productos/editar/:id ────► ProductoFormComponent (Reactive Forms)
                                           │
                                           ▼
                                 ProductoMockService (RxJS of() / In-Memory Mock)
```

---

## 📁 3. Estructura del Proyecto

```
Laboratorio_09A_UPN_Repaso_Codespaces_Angular_Mock/
├── diagramas/
│   └── arquitectura-lab09a.drawio            # Diagrama oficial editable Draw.io
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── encabezado/                   # Navbar y estado
│   │   │   └── catalogo/                     # Tabla reactiva con Signals y @for
│   │   ├── models/
│   │   │   └── producto.ts                   # Interfaz TypeScript de Producto
│   │   ├── pages/
│   │   │   └── producto-form/                # Formulario reactivo con FormBuilder y validaciones
│   │   ├── services/
│   │   │   ├── producto-mock.service.ts      # Simulación CRUD en memoria con RxJS
│   │   │   └── producto-mock.service.spec.ts # Pruebas unitarias automatizadas
│   │   ├── app.routes.ts                     # Definición de rutas y redirecciones
│   │   ├── app.config.ts                     # Configuración de proveedores de la app
│   │   ├── app.ts                            # Componente raíz Standalone
│   │   ├── app.html                          # Layout principal con RouterOutlet
│   │   └── app.scss                          # Estilos globales de la aplicación
│   ├── styles.scss                           # Estilos base modernos y responsivos
│   └── main.ts                               # Bootstrap de la aplicación Angular
├── angular.json
├── package.json
└── README.md
```

---

## ⚡ 4. Características Técnicas Implementadas

1. **Standalone Components:** Código limpio sin `NgModule`, preparado para el estándar de Angular moderno.
2. **Angular Signals (`signal`):** Gestión del estado de productos reactivo en el catálogo (`productos = signal<Producto[]>([])`).
3. **Flujo de Control Moderno (`@for`, `@if`):** Reemplazo de directivas obsoletas (`*ngFor`, `*ngIf`) por la sintaxis nativa de alto rendimiento de Angular.
4. **Formularios Reactivos (`FormBuilder`):**
   - Nombre: Requerido, longitud mínima de 3 caracteres.
   - Precio: Requerido, mayor a S/ 0.01.
   - Stock: Requerido, mayor o igual a 0.
   - Feedback visual en tiempo real de errores de validación.
5. **Enrutamiento Completo:** Navegación entre listado, creación y edición con paso de parámetros de ruta (`:id`).
6. **Manejo Desacoplado con Mock:** Permite que el frontend sea testeado y validado de extremo a extremo sin depender de una base de datos o servidor backend activo.

---

## 🧪 5. Pruebas y Verificación

### Pruebas Unitarias Automatizadas
Se implementaron suites de prueba con Jasmine/Vitest para verificar el comportamiento de los modelos y servicios:

```bash
npm test -- --watch=false
```

**Resultado:**
- `ProductoMockService`: 4 pruebas superadas (creación, listado inicial, registro y búsqueda por ID).
- `App`: 1 prueba superada (montaje del componente raíz).
- **Total:** 5/5 pruebas aprobadas exitosamente.

### Compilación para Producción
```bash
npm run build
```
- Build generado exitosamente sin advertencias ni errores TypeScript en `dist/`.

---

## 🚀 6. Guía de Ejecución Local / Codespaces

### Prerrequisitos
- Node.js >= 20.x / 24.x
- npm >= 10.x
- Angular CLI (`npm install -g @angular/cli`)

### Instrucciones
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Orlandho/Laboratorio_09A_UPN_Repaso_Codespaces_Angular_Mock.git
   cd Laboratorio_09A_UPN_Repaso_Codespaces_Angular_Mock
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar el servidor de desarrollo:
   ```bash
   ng serve --host 0.0.0.0
   ```
4. Abrir en el navegador:
   `http://localhost:4200`

---

## 📝 7. Preguntas de Cierre Resueltas

1. **¿Qué ventaja tiene usar un servicio mock antes de disponer de una API?**  
   Permite paralelizar el trabajo entre equipos frontend y backend. El equipo frontend puede definir y validar interfaces de usuario, flujos de navegación, contratos de datos y validaciones de formularios sin depender de que el backend esté finalizado o desplegado.

2. **¿Qué diferencia existe entre `RouterLink` y `RouterOutlet`?**  
   `RouterLink` es una directiva aplicada a enlaces o botones que instruye al enrutador a navegar hacia una ruta específica sin recargar la página completa (SPA). Por otro lado, `RouterOutlet` es el marcador o contenedor en la plantilla HTML donde Angular inserta dinámicamente el componente asociado a la ruta activa.

3. **¿Por qué un servicio se llama `ProductoService` o `ProductoMockService` y no simplemente `Producto`?**  
   Para respetar el principio de responsabilidad única (SRP) y evitar colisiones semánticas. `Producto` representa la entidad o modelo de datos (interfaz/clase con atributos), mientras que `ProductoService` encapsula la lógica de negocio, persistencia, llamadas HTTP o simulación de datos.

4. **¿Qué puerto usa normalmente Angular y cuál Spring Boot?**  
   Por defecto, el servidor de desarrollo de Angular CLI (`ng serve`) se ejecuta en el puerto **4200**, mientras que el contenedor embebido Tomcat de Spring Boot se ejecuta en el puerto **8080**.

5. **¿Por qué será necesario CORS cuando frontend y backend se ejecuten en orígenes diferentes?**  
   Porque los navegadores aplican la política del mismo origen (Same-Origin Policy - SOP) por seguridad. Dado que Angular (puerto 4200) y Spring Boot (puerto 8080) tienen puertos distintos, son considerados orígenes diferentes, por lo que el backend debe emitir cabeceras CORS (`Access-Control-Allow-Origin`) autorizando explícitamente las peticiones del frontend.
