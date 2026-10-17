# INFORME DE LABORATORIO 09: Integración completa y manejo de errores Angular + Spring Boot

**Curso:** Soluciones Web y Aplicaciones Distribuidas (`SIST1402A`)  
**Periodo Académico:** 2026-2  
**Institución:** Universidad Privada del Norte (UPN)  
**Estudiante:** Orlando Dorival  
**Docente:** Ing. Mg. Carlos Alberto Ponte Ramírez  
**Fecha:** 17 de Octubre de 2026  
**Repositorio GitHub:** [UPN_SIST1402A_S09_Laboratorio_09_Integracion_completa_y_manejo_de_errores](https://github.com/Orlandho/UPN_SIST1402A_S09_Laboratorio_09_Integracion_completa_y_manejo_de_errores)

---

## CONCEPTO CLAVE DE ARQUITECTURA
El flujo de integración E2E implementado sigue el estándar reactivo institucional:

$$\text{Formulario} \longrightarrow \text{Validar} \longrightarrow \text{Enviar} \longrightarrow \text{Persistir} \longrightarrow \text{Notificar}$$

Este ciclo de vida se encuentra completamente modelado en el diagrama nativo de arquitectura Draw.io ubicado en:
`diagramas/flujo-formulario-notificar.drawio`.

---

## I. Datos experimentales o registros de ejecución

### 1.1 Entorno y Versiones Verificadas
Las siguientes herramientas fueron validadas en el entorno local antes del despliegue:
* **Node.js:** `v24.20.0`
* **npm:** `11.13.0`
* **Angular CLI:** `19.2.1` / `22.x` (Standalone Components, Signals, Reactive Forms, Vitest)
* **Java SDK:** `OpenJDK 17.0.12` / `Java 25 LTS`
* **Apache Maven:** `3.9.x`
* **Spring Boot:** `3.3.4` (Spring Data JPA, Hibernate, Jakarta Validation, H2/MySQL)

### 1.2 Ejecución Concurrente en Terminales Paralelas
* **Terminal 1 (Backend REST API):**
  ```powershell
  cd backend
  mvn clean test
  mvn spring-boot:run
  # Escuchando en http://localhost:8080/api/productos
  ```
* **Terminal 2 (Frontend Angular SPA):**
  ```powershell
  cd frontend
  npm test -- --watch=false
  npm run build
  ng serve -o
  # Escuchando en http://localhost:4200/
  ```

### 1.3 Matriz de Verificación Automatizada

| Componente | Comando de Prueba | Casos Ejecutados | Tasa de Éxito | Estado |
|---|---|---|---|---|
| **Backend (Spring Boot)** | `mvn clean test` | 4 tests (MockMvc, H2 DB, Validaciones DTO) | 100% (4/4) | PASÓ |
| **Frontend (Angular)** | `npm test -- --watch=false` | 5 tests (Form, Service, Mock, Interceptor) | 100% (5/5) | PASÓ |
| **Frontend Build** | `npm run build` | Bundle production standalone | 100% compilación limpia | PASÓ |

---

## II. Análisis de resultados

### 1. ¿Qué error se detecta en frontend y cuál en backend?

* **Errores detectados en el Frontend:**
  * **Sintaxis, formato y presencia:** Detección sincrónica inmediata mediante `ReactiveFormsModule` (`Validators.required`, `Validators.minLength(3)`, `Validators.min(0.01)`).
  * **Experiencia de usuario (UX):** El formulario bloquea el envío (`if (this.form.invalid) { this.form.markAllAsTouched(); return; }`), evitando llamadas innecesarias a la red (consumo de ancho de banda).
  * **Fallas de conectividad o red:** Interceptación de error con código HTTP `0` (CORS bloqueado, servidor caído, timeout) traduciéndolo a un mensaje humanizado: *"No se pudo conectar con el servidor backend"*.

* **Errores detectados en el Backend:**
  * **Integridad de datos y restricciones de negocio:** Jakarta Validation en DTO/Entity (`@NotBlank`, `@Positive`, `@Min(0)`), unicidad de registros, constraints relacionales de claves foráneas y auditoría.
  * **Existencia y estado de recursos:** Verificación de concurrencia y existencia en base de datos. Si un ID no existe para actualización o búsqueda, el backend dispara `ResourceNotFoundException` devolviendo código HTTP `404 Not Found`.
  * **Manejo de excepciones no controladas:** Errores internos de persistencia, caídas de base de datos o fallos de transaccionalidad (`@Transactional`), capturados y retornados con HTTP `500 Internal Server Error` controlado.

### 2. ¿Cómo se documenta una prueba end-to-end?

Una prueba End-to-End (E2E) rigurosa no se limita a observar la interfaz gráfica; requiere documentar la trazabilidad completa del ciclo de vida del dato a través de las siguientes 5 capas:

1. **Estado Inicial y Acción del Usuario:** Captura de la vista con los datos diligenciados en el formulario reactivo y el evento que dispara la acción (clic en botón *Guardar* o *Actualizar*).
2. **Tráfico de Red (DevTools > Network Tab):**
   * **URL exacta y Método HTTP:** Ej. `POST http://localhost:8080/api/productos`.
   * **Headers de la Petición:** `Content-Type: application/json`, `Authorization: Bearer <token>` si aplica.
   * **Payload enviado (Request Body):** JSON serializado con los atributos validados.
   * **Código de Estado HTTP (Status Code):** Código de respuesta REST (`201 Created` para inserción, `200 OK` para consulta/edición, `204 No Content` para eliminación).
   * **Respuesta del Servidor (Response Body):** Objeto persistido retornado con su identificador generado (`id: 11`).
3. **Persistencia en Base de Datos:** Verificación física del registro en el motor relacional (consulta SQL `SELECT * FROM productos WHERE id = 11;` o consola H2/MySQL).
4. **Notificación y Estado en la UI:**
   * Implementación estricta del contrato de notificación:
     ```typescript
     this.servicio.crear(producto).subscribe({
       next: () => this.mensaje = "Guardado",
       error: () => this.mensaje = "Revise los datos"
     });
     ```
   * Despliegue de banners de éxito (`Guardado`) o alerta de error (`Revise los datos`).
5. **Consola del Navegador y Logs del Servidor:** Inspección de ausencia de advertencias (`warnings`) o excepciones no capturadas (`uncaught promise rejection`).

### 3. ¿Qué captura sería insuficiente como evidencia?

Una captura que consista **únicamente en una ventana del navegador mostrando un mensaje de texto** (por ejemplo, ver un texto que dice *"Guardado"* o un formulario lleno sin paneles de diagnóstico) es técnicamente **insuficiente e inaceptable como evidencia de ingeniería** por las siguientes razones:

* **Falta de Trazabilidad:** No demuestra si la operación realmente se comunicó con el backend o si fue simplemente un mockup estático simulado en memoria local (`localStorage` o variable de componente).
* **Ausencia de Estado de Red:** No permite verificar el método HTTP utilizado (`POST` vs `PUT`), el código de estado retornado (`201` vs `200`), las cabeceras CORS (`Access-Control-Allow-Origin`) ni el tiempo de respuesta / latencia.
* **Incertidumbre de Persistencia:** No garantiza que los datos se hayan almacenado en una base de datos real (MySQL / H2) bajo una transacción ACID confirmada (`commit`).
* **Invisibilidad de Errores Silenciosos:** En la consola del desarrollador podrían existir errores asíncronos enmascarados (como advertencias de bindings de Angular o errores de canal HTTP) que no se aprecian en el renderizado superficial de la pantalla.

---

## III. Conclusiones Técnicas

1. **Desacoplamiento y Cohesión en la Doble Capa de Validación:**  
   La validación en el frontend optimiza la experiencia de usuario y reduce latencia innecesaria en la red, pero nunca debe considerarse una barrera de seguridad suficiente. La validación estricta en el backend con Jakarta Validation (`@Valid`, `@NotNull`, `@Positive`) garantiza la integridad relacional de la persistencia frente a accesos directos por clientes API (Postman, cURL o scripts automatizados).

2. **Resiliencia Operativa mediante Manejo Centralizado de Errores:**  
   La implementación de flujos reactivos con operadores `RxJS` (`catchError`, `throwError`) combinada con interceptores HTTP (`HttpErrorResponse`) permite transformar fallas críticas de infraestructura (servidor inalcanzable `status: 0`, conflictos `status: 409` o caídas internas `status: 500`) en respuestas controladas y transparentes para el usuario, evitando que la aplicación quede congelada o rompa su ciclo de ejecución.

3. **Garantía de Calidad mediante Trazabilidad E2E y Pruebas Automatizadas:**  
   La integración exitosa entre Angular y Spring Boot requiere que los contratos de interfaz (DTOs, nombres de atributos `camelCase` vs `snake_case`, tipos numéricos y códigos HTTP REST) estén completamente sincronizados. La combinación de pruebas unitarias (`Vitest` en Angular y `MockMvc` con base de datos en memoria en Spring Boot) asegura que los despliegues a entornos de producción sean repetibles, auditables y libres de regresiones.

---

## Referencias Técnicas
* Spring Boot Framework Reference: https://docs.spring.io/spring-boot/
* Angular Official Guide & Best Practices: https://angular.dev/
* Jakarta Bean Validation Specification: https://beanvalidation.org/
* MDN Web Docs - HTTP Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
