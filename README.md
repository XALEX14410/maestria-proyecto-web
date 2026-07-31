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

## Autenticacion JWT - Sesion 7

La practica implementa un login JWT con usuario simulado para desarrollo:

* **Correo:** admin@univo.edu.mx
* **Contrasena:** 12345
* **Rol:** ADMIN

El endpoint `POST /api/v1/auth/login` valida estas credenciales simuladas y devuelve un token JWT firmado con HS256. La llave se configura con `JWT_SECRET` o con el valor local de desarrollo definido en `backend-app/src/main/resources/application.properties`; no se deben guardar secretos reales en el repositorio.

El guard de Angular protege la navegacion hacia `/dashboard`, pero no representa seguridad real del backend. Una siguiente iteracion debe integrar Spring Security, filtro JWT, validacion del token y proteccion de endpoints REST.
