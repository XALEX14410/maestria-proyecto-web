# TaskHive

**Autor:** Jesús Alejandro Lara Castro
**Materia:** Desarrollo de Aplicaciones para Internet - Maestría en Sistemas

## Descripción del Proyecto

**TaskHive** es una plataforma de Software as a Service (SaaS) enfocada en la automatización, organización y gestión eficiente de tareas y procesos. El sistema centraliza la información y utiliza herramientas de Inteligencia Artificial para mejorar la toma de decisiones, sugerir optimizaciones y agilizar los flujos de trabajo de los usuarios finales.

## Contexto Actual

El desarrollo se encuentra integrando funcionalidades avanzadas de Inteligencia Artificial mediante **Spring AI**. Específicamente, el backend está configurado para consumir modelos de lenguaje de alto rendimiento a través de **Groq**, exponiendo servicios REST seguros para potenciar las funcionalidades inteligentes de la plataforma.

## Stack Tecnológico

* **Frontend:** Angular
* **Backend:** Java 21 + Spring Boot 3
* **Base de Datos:** PostgreSQL
* **Inteligencia Artificial:** Spring AI + Groq API (LLMs)

## Entrega Sprint 4

La entrega final queda orientada a una arquitectura desacoplada en produccion:

* **Frontend:** Angular publicado en Vercel como SPA.
* **Backend:** Spring Boot publicado en Railway o Render con HTTPS.
* **Base de datos:** PostgreSQL remoto, por ejemplo Neon.
* **IA:** Spring AI consumiendo Groq mediante `GROQ_API_KEY`.

El backend consume el schema base de TaskHive usado como referencia en `project-base-taskhive`: `projects`, `tasks`, `task_assignments`, `task_updates` y `users_app`. Sobre esa misma base se agrega la tabla `usuarios` para autenticar el login con credenciales almacenadas en la nube.

### Variables de entorno

Backend:

* `DB_URL`
* `DB_USERNAME`
* `DB_PASSWORD`
* `JWT_SECRET`
* `GROQ_API_KEY`
* `APP_CORS_ALLOWED_ORIGINS`
* `APP_DEMO_USER_ENABLED`
* `APP_DEMO_USER_EMAIL`
* `APP_DEMO_USER_PASSWORD`
* `NIXPACKS_JDK_VERSION=21` (Railway)

Frontend:

* `NG_APP_API_BASE_URL`

Los archivos `.env.example` de `backend-app` y `frontend-app` muestran el formato esperado sin guardar secretos reales.

En Railway el backend arranca con perfil `prod`, por lo que `JWT_SECRET` es obligatorio y `spring.jpa.hibernate.ddl-auto=validate`. Para desarrollo local se puede usar el perfil `local`, que incluye una clave JWT de desarrollo de mas de 32 caracteres:

```bash
cd backend-app
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Antes del primer arranque en produccion, ejecutar en Neon el script idempotente:

```text
backend-app/src/main/resources/db/neon-schema.sql
```

Ese script crea las tablas esperadas sin borrar datos. El usuario demo se crea de forma idempotente desde la aplicacion cuando `APP_DEMO_USER_ENABLED=true`; la contrasena se almacena con BCrypt.

### Validaciones clave

* `frontend-app/vercel.json` incluye rewrite a `index.html` para evitar 404 al recargar subrutas.
* Angular lee `src/assets/runtime-config.json`, generado durante el build, para consumir el backend HTTPS configurado.
* `POST /api/v1/auth/login` valida el usuario contra la tabla `usuarios` y emite JWT solo si las credenciales existen en la base de datos remota.
* Las contrasenas de `usuarios` se comparan con BCrypt; no se guardan contrasenas en texto plano desde la aplicacion.
* `GET /api/v1/tareas` lee tareas reales desde `tasks`, responsables desde `users_app` y asignaciones desde `task_assignments`.
* `GET /api/v1/status` es publico; los demas endpoints `/api/**` requieren `Authorization: Bearer <token>`.
* CORS se controla con `APP_CORS_ALLOWED_ORIGINS`; en produccion debe incluir la URL final de Vercel.
* El modulo IA llama a `/api/v1/ia/consulta`, carga el contexto de tareas desde la base y muestra estado de carga mientras espera la respuesta.
