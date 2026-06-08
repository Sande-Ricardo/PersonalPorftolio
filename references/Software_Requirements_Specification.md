# Software Requirements Specification (SRS)

## The Architect — Fullstack & AI Engineer Portfolio

---

| Campo              | Detalle                                      |
|--------------------|----------------------------------------------|
| **Versión**        | 1.0.0                                        |
| **Estado**         | Draft — Ready for Development Review         |
| **Fecha**          | 2026-06-07                                   |
| **Autor**          | Lead Software Architect / Technical Writer   |
| **Clasificación**  | Interno — Confidencial                       |
| **Estándar Base**  | IEEE 830 (modernizado para Agile/Serverless) |

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
   - 1.1 Propósito
   - 1.2 Alcance
   - 1.3 Glosario de Términos
2. [Descripción General del Sistema](#2-descripción-general-del-sistema)
   - 2.1 Perspectiva del Producto
   - 2.2 Tipos de Usuario
   - 2.3 Entorno Operativo
   - 2.4 Restricciones y Suposiciones
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
   - 3.1 Diagrama de Alto Nivel (Descripción Textual)
   - 3.2 Stack Tecnológico
   - 3.3 Estrategia de Renderizado
4. [Modelo de Datos](#4-modelo-de-datos)
   - 4.1 Colección `content`
   - 4.2 Colección `projects`
   - 4.3 Colección `messages`
   - 4.4 Colección `github_stats`
5. [Requerimientos Funcionales](#5-requerimientos-funcionales)
   - 5.1 Módulo: Sitio Público (Public Site)
   - 5.2 Módulo: Panel de Administración (Admin Panel)
   - 5.3 Módulo: Autenticación (Auth)
   - 5.4 Módulo: Integraciones Externas
6. [Requerimientos No Funcionales (NFRs)](#6-requerimientos-no-funcionales-nfrs)
   - 6.1 Rendimiento (Performance)
   - 6.2 Seguridad (Security)
   - 6.3 Escalabilidad
   - 6.4 Accesibilidad (Accessibility)
   - 6.5 SEO
   - 6.6 Mantenibilidad
7. [Estrategia de Despliegue y CI/CD](#7-estrategia-de-despliegue-y-cicd)
   - 7.1 Flujo de Despliegue en Vercel
   - 7.2 Gestión de Variables de Entorno
   - 7.3 Cron Jobs
   - 7.4 Estrategia de Branching

---

## 1. Introducción

### 1.1 Propósito

Este documento constituye la Especificación de Requerimientos de Software (SRS) para el proyecto **"The Architect — Fullstack & AI Engineer Portfolio"**. Su propósito es definir, de manera exhaustiva y sin ambigüedades, la totalidad de los requerimientos funcionales y no funcionales del sistema, estableciendo un contrato técnico entre las partes interesadas (stakeholders) y el equipo de desarrollo.

El documento servirá como fuente única de verdad durante las fases de diseño, implementación, pruebas y mantenimiento del proyecto. Cualquier decisión de implementación que contradiga o no esté contemplada en este documento deberá ser escalada para revisión y, de ser necesario, se generará una versión actualizada del SRS.

### 1.2 Alcance

El sistema a construir es una aplicación web de propósito dual:

**Componente 1 — Portfolio Público:** Una landing page de alto rendimiento, orientada al posicionamiento SEO y la conversión, que presenta las habilidades, proyectos y experiencia profesional del propietario. La experiencia de usuario es de tipo *single-page scroll* con secciones ancladas, complementada por rutas dinámicas para el detalle de proyectos individuales.

**Componente 2 — Panel de Administración (CMS Personalizado):** Una interfaz de gestión de contenido, completamente protegida por autenticación, que permite al administrador controlar en tiempo real la totalidad del contenido textual y multimedia del portfolio sin necesidad de modificar el código fuente. El sistema está diseñado como un template reutilizable, potencialmente adaptable por otros desarrolladores.

**Fuera del alcance (Out of Scope):**
- Funcionalidades de e-commerce o monetización.
- Sistema de comentarios públicos en proyectos.
- Soporte multi-idioma (i18n) en la versión 1.0.
- Aplicaciones móviles nativas (iOS / Android).
- Integración con plataformas de analítica avanzada (más allá de Vercel Analytics).

### 1.3 Glosario de Términos

| Término | Definición |
|---|---|
| **ISR** | Incremental Static Regeneration. Estrategia de Next.js que genera páginas estáticas en build-time y las regenera en background bajo demanda o por tiempo, sin necesidad de rebuild completo. |
| **CSR** | Client-Side Rendering. Renderizado que ocurre completamente en el navegador del cliente. Adecuado para interfaces altamente interactivas que no requieren indexación SEO. |
| **SSR** | Server-Side Rendering. Renderizado que ocurre en el servidor en cada petición. No se utiliza como estrategia principal en este proyecto. |
| **App Router** | Sistema de enrutamiento de Next.js (v13+) basado en el directorio `/app`, que soporta React Server Components (RSC), layouts anidados y Server Actions de forma nativa. |
| **RSC** | React Server Components. Componentes que se ejecutan exclusivamente en el servidor, sin enviar JavaScript al cliente. |
| **BaaS** | Backend as a Service. Plataforma que provee infraestructura de backend (base de datos, autenticación, etc.) como servicio gestionado. En este proyecto: Firebase. |
| **Firestore** | Base de datos NoSQL documental de Firebase, organizada en colecciones y documentos, con capacidad de tiempo real y consultas estructuradas. |
| **Cloudinary** | Plataforma SaaS de gestión, transformación y entrega de activos multimedia (imágenes y vídeos). Actúa como CDN especializado para media. |
| **Cron Job** | Tarea programada que se ejecuta automáticamente a intervalos de tiempo definidos. En este contexto, implementada mediante Vercel Cron. |
| **revalidatePath** | Función de Next.js que invalida la caché de ISR para una ruta específica, forzando su regeneración en la siguiente petición. |
| **Server Action** | Función asíncrona del servidor definida en Next.js con la directiva `"use server"`, que puede ser invocada directamente desde componentes del cliente. |
| **OAuth** | Open Authorization. Protocolo de autorización que permite a aplicaciones de terceros obtener acceso limitado a cuentas de usuario (en este caso, Google OAuth 2.0). |
| **CRUD** | Create, Read, Update, Delete. Las cuatro operaciones básicas de persistencia de datos. |
| **Lighthouse** | Herramienta de auditoría automatizada de Google para medir Performance, Accesibilidad, SEO y Best Practices de aplicaciones web. |
| **WCAG AA** | Web Content Accessibility Guidelines, nivel de conformidad AA. Estándar internacional de accesibilidad web. |
| **CMS** | Content Management System. Sistema de gestión de contenidos. |
| **SRS** | Software Requirements Specification. Este documento. |
| **FR** | Functional Requirement. Requerimiento funcional. |
| **NFR** | Non-Functional Requirement. Requerimiento no funcional. |
| **Monochrome Elegance** | Nombre del sistema de diseño UI/UX del proyecto. Estética brutalista, paleta de escala de grises estricta, líneas de 1px, sin border-radius. |
| **`revalidateTag`** | Función de Next.js para invalidar caché agrupada por etiquetas. |
| **CDN** | Content Delivery Network. Red de distribución de contenido. |

---

## 2. Descripción General del Sistema

### 2.1 Perspectiva del Producto

El portfolio actúa como un sistema autónomo y autocontenido. No depende de sistemas heredados (legacy) preexistentes. Se integra con tres plataformas externas de manera unidireccional o bidireccional controlada:

- **Firebase** (bidireccional): lectura de contenido para el sitio público, escritura/lectura para el panel de administración.
- **Cloudinary** (escritura desde el admin, lectura para el sitio público): gestión de activos multimedia.
- **GitHub API** (lectura unidireccional, vía Cron Job): obtención de datos de contribuciones.
- **Proveedor de Email** (escritura unidireccional): envío de notificaciones al administrador.

El sistema prioriza la experiencia del visitante sobre cualquier otra consideración. El panel de administración es una herramienta interna y su rendimiento, aunque aceptable, no es crítico.

### 2.2 Tipos de Usuario

El sistema contempla dos tipos de usuario con perfiles, permisos y necesidades completamente diferenciadas:

#### 2.2.1 Visitante (Visitor)

| Atributo | Descripción |
|---|---|
| **Definición** | Cualquier persona que accede al portfolio a través de un navegador web sin autenticación. |
| **Perfil típico** | Reclutador, hiring manager, cliente potencial, colaborador técnico, peer developer. |
| **Nivel técnico** | Variable (desde no técnico hasta senior engineer). |
| **Objetivo principal** | Evaluar las capacidades técnicas, proyectos realizados y la idoneidad profesional del propietario del portfolio. |
| **Acciones permitidas** | Navegar por el sitio público, ver detalle de proyectos, enviar mensajes a través del formulario de contacto. |
| **Acciones restringidas** | Acceso al panel de administración, lectura de mensajes de otros visitantes, modificación de contenido. |
| **Autenticación requerida** | No. |

#### 2.2.2 Administrador (Admin)

| Atributo | Descripción |
|---|---|
| **Definición** | Propietario del portfolio o cualquier usuario con credenciales autorizadas en Firebase Authentication. |
| **Perfil típico** | El desarrollador propietario del portfolio. |
| **Nivel técnico** | Senior. |
| **Objetivo principal** | Mantener el contenido del portfolio actualizado sin intervención en el código fuente. |
| **Acciones permitidas** | Todas las acciones del Visitante + acceso completo al CMS: gestión de textos, imágenes, proyectos y lectura de mensajes. |
| **Autenticación requerida** | Sí. Firebase Auth (Google OAuth o Email/Password). |

### 2.3 Entorno Operativo

#### Entorno de Producción

| Capa | Tecnología | Nivel de Servicio |
|---|---|---|
| **Hosting / CDN** | Vercel (Hobby Plan) | 99.99% SLA de Vercel |
| **Base de Datos** | Firebase Firestore (Spark Plan) | 99.95% SLA de Google |
| **Autenticación** | Firebase Authentication | 99.95% SLA de Google |
| **Almacenamiento de Media** | Cloudinary (Free Plan) | 99.9% SLA de Cloudinary |
| **Dominio / DNS** | A definir por el propietario | Dependiente del proveedor |

#### Entorno de Desarrollo

- **Lenguaje:** TypeScript 5.x estricto (`strict: true` en `tsconfig.json`).
- **Runtime:** Node.js LTS (v20.x o superior).
- **Gestor de Paquetes:** pnpm (preferido por eficiencia en monorepos y CI).
- **Editor Recomendado:** VS Code con extensiones ESLint, Prettier y Tailwind CSS IntelliSense.
- **Entorno Local:** Variables de entorno gestionadas mediante `.env.local`.

#### Compatibilidad de Navegadores

El sitio público debe ser completamente funcional y visualmente consistente en los siguientes navegadores (últimas 2 versiones estables):

- Google Chrome / Chromium
- Mozilla Firefox
- Apple Safari (macOS e iOS)
- Microsoft Edge

### 2.4 Restricciones y Suposiciones

**Restricciones:**
- El proyecto debe operar dentro de los límites de los planes gratuitos de Vercel, Firebase y Cloudinary en la versión 1.0.
- Todas las rutas del sitio público deben ser *statically served* o ISR. No se permite SSR puro para rutas públicas.
- El panel de administración es accesible únicamente bajo la ruta `/admin` y sus subrutas.
- El uso de JavaScript de terceros en el sitio público debe minimizarse al máximo para proteger el score de Performance de Lighthouse.

**Suposiciones:**
- El administrador tiene acceso a una cuenta de Google para el OAuth initial setup.
- El propietario provee el contenido inicial (textos, imágenes, proyectos) para el seed de Firestore.
- El dominio personalizado es configurado externamente por el propietario en el panel de Vercel.
- La API de GitHub que alimenta el gráfico de contribuciones es la API REST pública v3, que no requiere autenticación para perfiles públicos (aunque se recomienda un token para mayor límite de rate).

---

## 3. Arquitectura del Sistema

### 3.1 Diagrama de Alto Nivel (Descripción Textual)

La arquitectura sigue el patrón **Jamstack con BaaS**, complementado por capacidades de servidor de Next.js para Server Actions y API Routes.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                           │
│   Visitor → [Static/ISR Pages]     Admin → [CSR Dashboard]         │
└───────────────┬──────────────────────────┬──────────────────────────┘
                │  HTTP/HTTPS              │  HTTP/HTTPS
                ▼                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK / CDN                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   NEXT.JS APP ROUTER                        │   │
│  │                                                             │   │
│  │  ┌──────────────────┐    ┌──────────────────────────────┐  │   │
│  │  │  Public Routes   │    │   Protected Routes           │  │   │
│  │  │  / (landing)     │    │   /admin                     │  │   │
│  │  │  /projects/[id]  │    │   /admin/projects            │  │   │
│  │  │  Strategy: ISR   │    │   /admin/content             │  │   │
│  │  └────────┬─────────┘    │   /admin/messages            │  │   │
│  │           │               │   /admin/images              │  │   │
│  │  ┌────────▼─────────┐    │   Strategy: CSR              │  │   │
│  │  │  API Routes /    │    └───────────────────────────── ┘  │   │
│  │  │  Server Actions  │                                       │   │
│  │  │  - Contact form  │                                       │   │
│  │  │  - Revalidation  │                                       │   │
│  │  │  - Cron handler  │                                       │   │
│  │  └────────┬─────────┘                                       │   │
│  └───────────┼─────────────────────────────────────────────────┘   │
└──────────────┼──────────────────────────────────────────────────────┘
               │
               ├──────────────────────┬──────────────────┬────────────────
               ▼                      ▼                  ▼
┌──────────────────────┐  ┌────────────────────┐  ┌──────────────────┐
│  FIREBASE (Google)   │  │   CLOUDINARY       │  │  EMAIL PROVIDER  │
│                      │  │                    │  │  (Resend / SMTP) │
│  ┌────────────────┐  │  │  /portfolio/       │  │                  │
│  │ Firestore DB   │  │  │    /avatar/        │  │  Notificaciones  │
│  │ - content      │  │  │    /projects/      │  │  al Admin        │
│  │ - projects     │  │  │    /covers/        │  │                  │
│  │ - messages     │  │  │                    │  └──────────────────┘
│  │ - github_stats │  │  │  CDN Delivery      │
│  └────────────────┘  │  │  Transformaciones  │
│  ┌────────────────┐  │  │  (resize, WebP)    │
│  │ Firebase Auth  │  │  └────────────────────┘
│  │ Google OAuth   │  │
│  │ Email/Password │  │              ▲ Cron Job
│  └────────────────┘  │              │ (Vercel Cron)
└──────────────────────┘              │
                             ┌────────┴────────┐
                             │   GITHUB API    │
                             │  REST API v3    │
                             │ Contributions   │
                             └─────────────────┘
```

**Flujo de datos principal (Visitante):**
1. El visitante realiza una petición a la URL del portfolio.
2. Vercel Edge Network sirve la página estática previamente generada (ISR) desde su CDN global.
3. Si la página no está en caché o el `revalidate` expiró, Next.js ejecuta los RSC en el servidor, consulta Firestore, y genera el HTML. Cloudinary sirve las imágenes optimizadas directamente al cliente.
4. El HTML generado se almacena en la caché de Vercel y se sirve en subsiguientes peticiones.

**Flujo de datos principal (Admin):**
1. El administrador accede a `/admin`. Next.js verifica la sesión de Firebase Auth.
2. Si no hay sesión válida, redirige a `/admin/login`.
3. Una vez autenticado, la interfaz CSR carga los datos directamente desde Firestore via SDK del cliente.
4. Las mutaciones (crear/editar/eliminar) se realizan directamente contra Firestore (con reglas de seguridad) o vía Server Actions.
5. Tras una mutación de contenido público, se invoca `revalidatePath()` para invalidar la caché ISR de las rutas afectadas.

### 3.2 Stack Tecnológico

#### 3.2.1 Frontend

| Tecnología | Versión Mínima | Rol |
|---|---|---|
| **Next.js** | 14.x (App Router) | Framework principal, routing, SSR/ISR/CSR, Server Actions. |
| **React** | 18.x | Librería de UI. RSC + Client Components. |
| **TypeScript** | 5.x | Lenguaje de desarrollo. Strict mode habilitado. |
| **Tailwind CSS** | 3.x | Framework de utilidades CSS. Configurado para paleta monocromática. |
| **`react-markdown`** | Última estable | Renderizado de contenido Markdown en la vista de detalle de proyectos. |
| **`framer-motion`** | Última estable | Animaciones del boot sequence en Hero. Uso mínimo y controlado. |

#### 3.2.2 Backend / Servicios

| Tecnología | Plan | Rol |
|---|---|---|
| **Firebase Authentication** | Spark (Free) | Autenticación de administradores. |
| **Firestore** | Spark (Free) | Base de datos NoSQL. Fuente de verdad del contenido. |
| **Cloudinary** | Free | Almacenamiento, transformación y CDN de activos multimedia. |
| **Resend** (alternativa: Nodemailer + SMTP) | Free tier | Servicio de envío de emails transaccionales. |

#### 3.2.3 Infraestructura y DevOps

| Tecnología | Rol |
|---|---|
| **Vercel** | Hosting, CDN global, despliegue CI/CD automático, Vercel Cron. |
| **GitHub** | Repositorio de código fuente, integración con Vercel para CI/CD. |
| **pnpm** | Gestor de paquetes. |

#### 3.2.4 Calidad y Tooling

| Herramienta | Rol |
|---|---|
| **ESLint** | Linter estático con configuración `next/core-web-vitals`. |
| **Prettier** | Formateador de código. |
| **Husky + lint-staged** | Hooks de Git para validar código antes de cada commit. |

### 3.3 Estrategia de Renderizado

El sistema aplica una estrategia híbrida de renderizado, seleccionando el método óptimo según las características de cada ruta:

| Ruta | Estrategia | Justificación |
|---|---|---|
| `/` (landing) | ISR | Máximo rendimiento. Contenido semi-estático. Se regenera bajo demanda tras mutación en el admin. |
| `/projects/[id]` | ISR | Misma lógica. `generateStaticParams` pre-genera las rutas conocidas en build-time. |
| `/admin/*` | CSR | No requiere SEO. Alta interactividad. Acceso controlado por autenticación client-side. |
| `/admin/login` | CSR | Formulario de autenticación interactivo. |
| `API: /api/contact` | Server Route (Edge) | Procesamiento seguro del formulario. Escribe en Firestore e invoca el email. |
| `API: /api/cron/github` | Server Route | Ejecutado por Vercel Cron. Escribe en Firestore. |
| `API: /api/revalidate` | Server Route | Recibe el trigger desde el admin y ejecuta `revalidatePath`. Protegido por secret token. |

---

## 4. Modelo de Datos

Todas las colecciones residen en **Firebase Firestore**. El esquema utiliza documentos JSON (anidamiento controlado, sin sub-colecciones innecesarias para mantener la legibilidad de las reglas de seguridad).

### 4.1 Colección `content`

**Propósito:** Almacena la totalidad del contenido textual y configurable del portfolio. Cada documento representa una sección o agrupación lógica de contenido. Este diseño permite que el Admin edite cada sección de forma aislada.

**Estructura del documento principal: `/content/{sectionId}`**

```
Collection: content
│
├── Document: hero
│   ├── greeting: string           // "Hola, soy"
│   ├── name: string               // "John Doe"
│   ├── title: string              // "Fullstack & AI Engineer"
│   ├── tagline: string            // "Construyo productos..."
│   ├── cta_primary_text: string   // "Ver Proyectos"
│   ├── cta_primary_href: string   // "#projects"
│   ├── cta_secondary_text: string // "Descargar CV"
│   ├── cta_secondary_href: string // "/cv.pdf"
│   └── boot_sequence: array<string> // Líneas del boot animation
│
├── Document: about
│   ├── title_label: string        // Sobrescritura opcional del label
│   ├── bio_paragraphs: array<string> // Párrafos del "About Me"
│   ├── avatar_url: string         // URL de Cloudinary
│   ├── avatar_alt: string         // Texto alternativo de la imagen
│   └── highlights: array<object> // [{label: string, value: string}]
│       // Ej: [{label: "Años de exp.", value: "5+"}, ...]
│
├── Document: stack
│   ├── description: string        // Párrafo introductorio de la sección
│   └── categories: array<object>
│       // [{category: string, skills: array<{name: string, icon_slug: string, level: 1-5}>}]
│
├── Document: experience
│   ├── description: string
│   └── entries: array<object>
│       // [{
│       //   id: string (UUID),
│       //   company: string,
│       //   role: string,
│       //   period_start: string ("YYYY-MM"),
│       //   period_end: string ("YYYY-MM" | "present"),
│       //   location: string,
│       //   description: string,
│       //   tags: array<string>
│       // }]
│
├── Document: contact
│   ├── heading: string            // "¿Trabajamos juntos?"
│   ├── description: string        // Texto de invitación al contacto
│   ├── email_display: string      // Email visible al público
│   ├── availability_status: string // "Disponible para proyectos freelance"
│   ├── availability_badge: string  // "open_to_work" | "busy" | "unavailable"
│   └── social_links: array<object>
│       // [{platform: string, url: string, label: string}]
│
└── Document: site_meta
    ├── site_title: string          // "John Doe | Fullstack & AI Engineer"
    ├── site_description: string    // Meta description global
    ├── og_image_url: string        // URL de imagen Open Graph
    ├── twitter_handle: string      // "@handle"
    └── canonical_url: string       // "https://portfolio.dev"
```

### 4.2 Colección `projects`

**Propósito:** Almacena cada proyecto del portfolio. Alimenta tanto la grilla en la landing como la vista de detalle `/projects/[id]`.

**Documento: `/projects/{projectId}`**

```
Collection: projects
│
└── Document: {projectId}           // ID generado por Firestore o slug legible
    ├── id: string                   // Redundante con doc ID, útil para queries
    ├── slug: string                 // URL-friendly: "my-project-name"
    ├── title: string
    ├── short_description: string    // Para la tarjeta en la grilla (max 160 chars)
    ├── status: string               // "published" | "draft" | "archived"
    ├── featured: boolean            // Aparece destacado en la grilla
    ├── order: number                // Orden de aparición en la grilla
    │
    ├── // --- Metadata ---
    ├── tags: array<string>          // ["Next.js", "Firebase", "TypeScript"]
    ├── category: string             // "web" | "mobile" | "ai" | "oss"
    ├── period_start: string         // "YYYY-MM"
    ├── period_end: string           // "YYYY-MM" | "present"
    │
    ├── // --- Media ---
    ├── cover_image_url: string      // URL Cloudinary - imagen de la tarjeta
    ├── cover_image_alt: string
    ├── screenshots: array<object>   // [{url: string, alt: string, caption: string}]
    │
    ├── // --- Links ---
    ├── repo_url: string             // GitHub repo URL (puede ser null si es privado)
    ├── live_url: string             // URL del proyecto desplegado
    ├── case_study_url: string       // URL externa opcional
    │
    ├── // --- Vista de Detalle ---
    ├── readme_content: string       // Contenido Markdown del README
    ├── metrics: array<object>       // [{label: string, value: string, unit: string}]
    │                                // Ej: [{label: "Uptime", value: "99.9", unit: "%"}]
    ├── architecture_description: string // Descripción textual de la arquitectura
    ├── architecture_diagram_url: string // URL Cloudinary (diagrama de arquitectura)
    │
    ├── // --- Auditoría ---
    ├── created_at: Timestamp        // Firestore Timestamp
    └── updated_at: Timestamp        // Firestore Timestamp
```

### 4.3 Colección `messages`

**Propósito:** Almacena los mensajes enviados a través del formulario de contacto público. Es de escritura pública (con validaciones en Server Action) y de lectura exclusivamente desde el panel de administración.

**Documento: `/messages/{messageId}`**

```
Collection: messages
│
└── Document: {messageId}            // Auto-generado por Firestore
    ├── name: string                  // Nombre del remitente
    ├── email: string                 // Email del remitente
    ├── subject: string               // Asunto (opcional o predefinido)
    ├── body: string                  // Cuerpo del mensaje
    ├── status: string                // "unread" | "read" | "archived"
    ├── ip_hash: string               // Hash SHA-256 de la IP (privacidad + anti-spam)
    ├── user_agent: string            // User-Agent del navegador (anti-spam)
    └── received_at: Timestamp        // Firestore Timestamp
```

**Reglas de seguridad de Firestore para `messages`:**
- `create`: Permitido para cualquier usuario no autenticado (público), con validación de esquema.
- `read`, `update`, `delete`: Restringido a usuarios autenticados.

### 4.4 Colección `github_stats`

**Propósito:** Almacena los datos de contribuciones de GitHub, actualizados periódicamente por el Cron Job. Desacopla el frontend de la API de GitHub, eliminando latencia y riesgo de rate-limiting.

**Documento: `/github_stats/contributions`** (documento único, sobreescrito en cada ejecución del Cron)

```
Collection: github_stats
│
└── Document: contributions
    ├── username: string               // "github-handle"
    ├── updated_at: Timestamp          // Última actualización del Cron
    ├── total_contributions_last_year: number
    ├── current_streak: number         // Racha actual en días
    ├── longest_streak: number         // Racha más larga histórica
    │
    └── weeks: array<object>           // Array de 52 semanas (o 53)
        // [{
        //   week_start: string,       // "YYYY-MM-DD"
        //   days: array<object>
        //   // [{
        //   //   date: string,        // "YYYY-MM-DD"
        //   //   count: number,       // Número de contribuciones
        //   //   level: number        // 0-4 (intensidad para el grafo)
        //   // }]
        // }]
```

---

## 5. Requerimientos Funcionales

Los requerimientos funcionales se identifican con el prefijo `FR-` seguido del módulo abreviado y un número secuencial.

### 5.1 Módulo: Sitio Público (Public Site)

**Prefijo de identificadores:** `FR-PUB-`

---

#### FR-PUB-01 — Navegación Principal (Header Fijo)

**Descripción:** El sitio debe presentar un header de navegación que permanezca fijo en la parte superior de la pantalla durante el scroll del usuario.

**Criterios de Aceptación:**
- El header contiene el logotipo/nombre del propietario y enlaces de ancla a cada sección principal (`#hero`, `#about`, `#stack`, `#github`, `#projects`, `#experience`, `#contact`).
- El header tiene fondo opaco o con efecto de blur para mantener legibilidad sobre el contenido subyacente.
- En dispositivos móviles (< 768px), los enlaces de navegación se colapsan en un menú hamburguesa.
- La altura del header es un valor fijo conocido y es utilizada en el cálculo de altura de secciones y en los `scroll-margin-top` de cada ancla.
- El enlace activo (sección visible actualmente) se resalta de acuerdo al sistema de diseño Monochrome Elegance.

---

#### FR-PUB-02 — Sección Hero (Boot Sequence)

**Descripción:** La primera sección del portfolio presenta una animación de "boot sequence" que simula la carga de un sistema de terminal antes de revelar el nombre y título del propietario.

**Criterios de Aceptación:**
- La sección ocupa exactamente `100dvh` (o `calc(100vh - header_height)` como fallback) en su estado inicial.
- La secuencia de boot muestra las líneas definidas en `content/hero.boot_sequence` de Firestore de manera secuencial, con un efecto de escritura (typewriter) o aparición progresiva.
- Tras completar la secuencia, se revela el nombre (`content/hero.name`) en tipografía de gran escala y el título (`content/hero.title`).
- Se presentan dos CTAs: `cta_primary` (link interno a `#projects`) y `cta_secondary` (link a CV en PDF, apertura en nueva pestaña).
- La animación puede ser omitida (skipped) mediante una interacción del usuario o si el usuario ha indicado preferencia por movimiento reducido (`prefers-reduced-motion: reduce`).
- El contenido de esta sección (textos, hrefs de CTAs) es consumido desde Firestore.

---

#### FR-PUB-03 — Sección About Me

**Descripción:** Presenta una descripción biográfica y profesional del propietario, junto con una imagen de avatar.

**Criterios de Aceptación:**
- La sección muestra los párrafos definidos en `content/about.bio_paragraphs` de forma separada.
- La imagen de avatar se carga desde la URL en `content/about.avatar_url` (Cloudinary). Debe incluir el `alt` text de `content/about.avatar_alt`.
- Los "highlights" (métricas clave como años de experiencia, proyectos completados) se muestran en un formato de grilla o lista estructurada, consumidos desde `content/about.highlights`.
- En mobile, la imagen se apila sobre el texto. En desktop, se presentan en layout de dos columnas.
- La imagen se sirve con el componente `<Image />` de Next.js con prioridad de carga apropiada (no es LCP en la mayoría de viewports, pero se evalúa).

---

#### FR-PUB-04 — Sección Stack & Skills (Matriz de Tecnologías)

**Descripción:** Presenta el conjunto de tecnologías y habilidades del propietario, organizado por categorías.

**Criterios de Aceptación:**
- Las habilidades se agrupan en categorías definidas en `content/stack.categories`.
- Cada habilidad presenta su nombre y un icono (derivado de `icon_slug`, utilizando una librería como `simple-icons` o iconos SVG propios).
- Todos los iconos son monocromáticos (escala de grises) para mantener coherencia con el sistema de diseño.
- El nivel de habilidad (`level: 1-5`) puede representarse opcionalmente mediante un indicador visual (barra, puntos).
- El layout es responsive: más columnas en pantallas más amplias, sin desbordamiento horizontal en móvil.

---

#### FR-PUB-05 — Sección GitHub Contributions (Grafo de Actividad)

**Descripción:** Presenta un grafo de contribuciones de GitHub estilo "heatmap", similar al que muestra GitHub en los perfiles públicos, pero renderizado de forma monocromática.

**Criterios de Aceptación:**
- Los datos se consumen **exclusivamente desde Firestore** (`github_stats/contributions`), NO desde la API de GitHub directamente en el cliente.
- El grafo visualiza las semanas del array `weeks`, representando cada día como una celda cuyo nivel de opacidad o tono de gris corresponde al campo `level` (0: sin actividad, 4: máxima actividad).
- Se muestran estadísticas adicionales: total de contribuciones en el último año, racha actual y racha más larga.
- El grafo es horizontalmente scrollable en pantallas pequeñas donde no quepa la vista completa de 52 semanas.
- Si los datos en Firestore tienen más de 24 horas de antigüedad, se muestra un indicador sutil de "last updated" sin afectar el score de rendimiento.

---

#### FR-PUB-06 — Sección Projects (Grilla de Proyectos)

**Descripción:** Presenta una grilla de tarjetas de proyectos, mostrando los proyectos publicados.

**Criterios de Aceptación:**
- Se consultan los documentos de la colección `projects` con `status == "published"`, ordenados por `order` ascendente.
- Cada tarjeta muestra: `cover_image_url`, `title`, `short_description`, y los `tags` más relevantes (máximo 3 en la vista de tarjeta).
- Los proyectos con `featured: true` pueden presentarse con un estilo destacado (mayor tamaño en la grilla o badge distintivo).
- Al hacer clic en una tarjeta, se navega a la ruta dinámica `/projects/[slug]`.
- El layout de la grilla es responsivo: 1 columna en móvil, 2 columnas en tablet, 3 columnas en desktop.
- Las imágenes de las tarjetas se cargan con `loading="lazy"` y son servidas desde Cloudinary con las transformaciones de tamaño apropiadas.

---

#### FR-PUB-07 — Vista de Detalle de Proyecto (`/projects/[id]`)

**Descripción:** Página individual con documentación técnica detallada de cada proyecto.

**Criterios de Aceptación:**
- La ruta es dinámica: `/projects/[slug]`. El parámetro `[slug]` debe ser resuelto usando el campo `slug` de Firestore.
- `generateStaticParams` pre-genera en build-time todas las rutas de proyectos con `status == "published"`.
- La página presenta en secciones ordenadas:
  1. **Header:** `title`, `category`, `tags`, `period_start` - `period_end`, links a `repo_url` y `live_url`.
  2. **Cover Image:** Imagen de portada a ancho completo.
  3. **Métricas:** Tarjetas con los datos del array `metrics` ({label, value, unit}).
  4. **Descripción de Arquitectura:** Texto de `architecture_description`. Si `architecture_diagram_url` existe, se muestra el diagrama debajo.
  5. **README Renderizado:** El contenido de `readme_content` se renderiza usando `react-markdown` con plugins de sintaxis de código (`rehype-highlight` o `rehype-prism`). El estilo de código es monocromático.
  6. **Screenshots:** Galería de las imágenes en el array `screenshots`.
  7. **CTA de Regreso:** Botón de retorno a `/#projects`.
- Si el `slug` no existe, retorna una página 404 personalizada.
- Se implementa `generateMetadata` para generar meta tags (`title`, `description`, `og:image`, `og:title`) dinámicamente por proyecto.

---

#### FR-PUB-08 — Sección Experience (Timeline "git log")

**Descripción:** Presenta la trayectoria profesional del propietario en formato de línea de tiempo estilizada como la salida del comando `git log`.

**Criterios de Aceptación:**
- Las entradas se consumen desde `content/experience.entries`, ordenadas por `period_start` descendente (más reciente primero).
- Cada entrada muestra: `company`, `role`, `period_start` - `period_end` (formateados como "MMM YYYY"), `location`, `description`, y `tags`.
- El estilo visual evoca la salida de `git log --oneline --graph`: uso de carácteres de pseudo-terminal (pipes `│`, puntos de commit `●`), tipografía monospace para los metadatos, y colores en escala de grises.
- En mobile, el layout es de una sola columna con la línea temporal a la izquierda.

---

#### FR-PUB-09 — Sección Contact (Formulario y Disponibilidad)

**Descripción:** Presenta un formulario de contacto y el estado de disponibilidad del propietario para proyectos.

**Criterios de Aceptación:**
- El formulario incluye los campos: Nombre (requerido), Email (requerido, formato válido), Asunto (opcional), Mensaje (requerido, mínimo 20 caracteres).
- El formulario implementa validación en el lado del cliente (antes del envío) y en el lado del servidor (en el Server Action).
- El estado de disponibilidad se consume desde `content/contact.availability_status` y `content/contact.availability_badge`, mostrando un indicador visual (badge) acorde.
- Los links a redes sociales se consumen desde `content/contact.social_links`.
- Al envío exitoso del formulario, se muestra un mensaje de confirmación al usuario y el formulario se limpia.
- En caso de error, se muestra un mensaje de error descriptivo sin revelar detalles internos del sistema.
- El formulario incluye protección básica anti-spam (honeypot field o rate limiting a nivel de Server Action).

---

#### FR-PUB-10 — Altura Dinámica de Secciones

**Descripción:** Cada sección principal de la landing ocupa un mínimo de `100vh` menos la altura del header, expandiéndose si el contenido lo requiere.

**Criterios de Aceptación:**
- Cada sección utiliza `min-height: calc(100dvh - var(--header-height))` como mínimo.
- La altura de la sección se expande automáticamente si su contenido supera el mínimo definido.
- `--header-height` es una variable CSS definida en el root, calculada en runtime si la altura del header es variable, o como constante si es fija.
- No se utiliza `overflow: hidden` que pueda recortar contenido.

---

#### FR-PUB-11 — SEO y Metadatos Dinámicos

**Descripción:** El sistema genera metadatos SEO dinámicos para todas las rutas públicas.

**Criterios de Aceptación:**
- La ruta principal `/` genera metadatos desde `content/site_meta` (title, description, og:image, og:url, twitter:card).
- La ruta `/projects/[slug]` genera metadatos dinámicos vía `generateMetadata` con datos específicos del proyecto.
- Todas las páginas incluyen un `<link rel="canonical">` apropiado.
- Se implementa un `sitemap.xml` dinámico que incluye la ruta raíz y todas las rutas de proyectos publicados.
- Se implementa un `robots.txt` que permite la indexación de rutas públicas y deniega el acceso a `/admin/*`.
- Se incluye schema.org JSON-LD para el perfil del propietario (`Person`) en la landing y para cada proyecto (`SoftwareApplication`) en las vistas de detalle.

---

### 5.2 Módulo: Panel de Administración (Admin Panel)

**Prefijo de identificadores:** `FR-ADM-`

---

#### FR-ADM-01 — Layout General del Panel

**Descripción:** El panel de administración debe tener una estructura de layout consistente para todas sus vistas.

**Criterios de Aceptación:**
- El layout incluye: sidebar de navegación lateral (en desktop), header superior con información del usuario autenticado y botón de logout.
- En mobile, el sidebar se colapsa en un menú drawer.
- La navegación del sidebar incluye links a: Dashboard, Contenido (Content), Proyectos (Projects), Imágenes, Mensajes y Configuración.
- Un "Dashboard" muestra un resumen rápido: número de proyectos, mensajes sin leer, última actualización del grafo de GitHub.

---

#### FR-ADM-02 — Gestión de Contenido Textual

**Descripción:** El administrador puede editar la totalidad del contenido textual del portfolio, sección por sección, desde el panel.

**Criterios de Aceptación:**
- Existe una vista de edición dedicada para cada documento de la colección `content` (Hero, About, Stack, Experience, Contact, Site Meta).
- Los campos de texto corto utilizan `<input type="text">`. Los campos de texto largo utilizan `<textarea>`. Los campos de tipo array (como `bio_paragraphs` o `boot_sequence`) tienen una UI de lista editable donde se pueden agregar, reordenar y eliminar ítems.
- Los cambios se persisten en Firestore en tiempo real (on-blur o on-save con botón explícito).
- Tras guardar cambios en cualquier sección, el sistema invoca automáticamente `revalidatePath('/')` (y `revalidatePath('/projects')` si aplica) para refrescar el caché ISR.
- La UI de edición muestra el estado de guardado (loading, success, error) de forma clara.

---

#### FR-ADM-03 — Gestión de Proyectos (CRUD)

**Descripción:** El administrador puede crear, leer, actualizar y eliminar proyectos desde el panel.

**Criterios de Aceptación:**
- **Listado:** Vista tabular de todos los proyectos (incluyendo drafts y archivados), con columnas: título, estado, featured, fecha de actualización. Con acciones de editar y eliminar por fila.
- **Creación / Edición:** Un formulario completo con campos para todos los atributos del modelo `projects`. El campo `readme_content` tiene un editor de Markdown con preview en tiempo real (puede ser un textarea con tab de preview). El campo `slug` se genera automáticamente a partir del `title` pero puede ser editado manualmente.
- **Gestión de estado:** El administrador puede cambiar el `status` de un proyecto entre "draft", "published" y "archived".
- **Gestión de orden:** Los proyectos pueden reordenarse mediante drag-and-drop o campos numéricos de orden.
- **Eliminación:** Requiere confirmación explícita (modal/dialog). Proyectos eliminados se borran de Firestore (hard delete) y se invoca `revalidatePath`.
- **Actualización de caché:** Tras cualquier modificación de un proyecto publicado, se invoca `revalidatePath('/projects/[slug]')` y `revalidatePath('/')`.

---

#### FR-ADM-04 — Gestión de Imágenes (Cloudinary)

**Descripción:** El administrador puede subir y gestionar las imágenes del portfolio a través de una integración con Cloudinary.

**Criterios de Aceptación:**
- Existe una sección de "Gestión de Imágenes" en el panel donde se pueden subir imágenes por categoría: Avatar, Covers de Proyectos, Screenshots, Diagramas de Arquitectura.
- El flujo de subida es: el cliente envía el archivo a un Server Action → el Server Action sube el archivo a Cloudinary usando el SDK de Cloudinary para Node.js → Cloudinary devuelve la `secure_url` → el Server Action devuelve la URL al cliente → el cliente la almacena en el campo correspondiente de Firestore.
- Las imágenes se organizan en Cloudinary en carpetas específicas:
  - `portfolio/avatar/` para el avatar del propietario.
  - `portfolio/projects/covers/` para imágenes de portada de proyectos.
  - `portfolio/projects/screenshots/` para screenshots de proyectos.
  - `portfolio/diagrams/` para diagramas de arquitectura.
- Se muestran previsualizaciones de las imágenes subidas.
- Se validan las dimensiones y peso de los archivos antes de la subida (máximo 10MB, formatos: JPG, PNG, WebP, GIF).
- Las URLs guardadas en Firestore corresponden a la `secure_url` de Cloudinary (HTTPS).

---

#### FR-ADM-05 — Bandeja de Entrada de Mensajes

**Descripción:** El administrador puede leer y gestionar los mensajes recibidos a través del formulario de contacto.

**Criterios de Aceptación:**
- La bandeja muestra todos los documentos de la colección `messages`, ordenados por `received_at` descendente.
- Los mensajes con `status: "unread"` se muestran con un indicador visual diferenciador.
- Al seleccionar un mensaje, se muestra su contenido completo: nombre, email, asunto, cuerpo y fecha de recepción.
- Al abrir un mensaje con `status: "unread"`, se actualiza automáticamente su status a `"read"` en Firestore.
- Existe una acción para archivar un mensaje (`status: "archived"`).
- Existe un botón de "Responder" que abre el cliente de email predeterminado del sistema con el campo `To:` pre-rellenado con el email del remitente.
- La bandeja muestra el contador de mensajes no leídos en el link del sidebar.

---

#### FR-ADM-06 — Actualización Manual del Grafo de GitHub

**Descripción:** El administrador puede forzar una actualización manual de los datos del grafo de contribuciones de GitHub desde el panel.

**Criterios de Aceptación:**
- Existe un botón "Actualizar ahora" en el dashboard del panel que invoca el endpoint del Cron Job de GitHub manualmente.
- El botón muestra el estado de la última actualización (`github_stats/contributions.updated_at`).
- El proceso de actualización es asíncrono; el UI muestra un estado de "Actualizando..." mientras se ejecuta.

---

### 5.3 Módulo: Autenticación (Auth)

**Prefijo de identificadores:** `FR-AUTH-`

---

#### FR-AUTH-01 — Acceso al Panel de Administración

**Descripción:** Todas las rutas bajo `/admin` (excepto `/admin/login`) deben estar protegidas y requerir autenticación.

**Criterios de Aceptación:**
- Un usuario no autenticado que intenta acceder a cualquier ruta `/admin/*` es redirigido automáticamente a `/admin/login`.
- La protección se implementa a nivel de middleware de Next.js (`middleware.ts`) que verifica la presencia de una cookie de sesión válida o token de Firebase Auth.
- Un usuario autenticado que accede a `/admin/login` es redirigido automáticamente al dashboard `/admin`.

---

#### FR-AUTH-02 — Inicio de Sesión

**Descripción:** El administrador puede iniciar sesión utilizando Google OAuth o Email/Password.

**Criterios de Aceptación:**
- La página `/admin/login` presenta dos opciones: "Continuar con Google" (OAuth) y un formulario de Email/Password.
- La autenticación con Google redirige al flujo OAuth de Google y, al completarse, redirige al dashboard.
- La autenticación con Email/Password valida las credenciales contra Firebase Authentication.
- Si las credenciales son incorrectas, se muestra un mensaje de error genérico (sin revelar si el email existe o no).
- Los intentos de inicio de sesión fallidos repetidos deben ser manejados por Firebase Auth (bloqueo temporal automático).
- El token de sesión de Firebase se gestiona en el cliente. Para mayor seguridad, se puede implementar una cookie de sesión server-side usando `firebase-admin` SDK y la función `createSessionCookie`.

---

#### FR-AUTH-03 — Cierre de Sesión (Logout)

**Descripción:** El administrador autenticado puede cerrar su sesión en cualquier momento.

**Criterios de Aceptación:**
- Existe un botón "Logout" visible y accesible en el header del panel de administración.
- Al ejecutar logout, se invalida la sesión de Firebase Auth en el cliente y, si se usan cookies de sesión server-side, se elimina la cookie.
- Tras el logout, el usuario es redirigido a `/admin/login`.
- No queda ningún dato sensible del administrador accesible en el localStorage o sessionStorage del navegador tras el logout.

---

#### FR-AUTH-04 — Restricción de Acceso por Lista de Usuarios Autorizados

**Descripción:** No cualquier cuenta de Google o email puede acceder al panel. Solo usuarios explícitamente autorizados.

**Criterios de Aceptación:**
- Tras una autenticación exitosa con Firebase Auth, el sistema verifica que el UID o email del usuario autenticado pertenece a una lista de UIDs/emails autorizados.
- Esta lista puede configurarse como variable de entorno (`ADMIN_EMAILS`) o como una colección especial en Firestore (`/config/allowed_users`).
- Si el usuario autenticado no está en la lista, se cierra inmediatamente la sesión y se redirige a `/admin/login` con un mensaje de "Acceso denegado".
- Las reglas de seguridad de Firestore deben reforzar este control a nivel de base de datos.

---

### 5.4 Módulo: Integraciones Externas

**Prefijo de identificadores:** `FR-INT-`

---

#### FR-INT-01 — Formulario de Contacto (Server Action + Firestore + Email)

**Descripción:** El envío del formulario de contacto desencadena una secuencia de acciones del servidor: persistencia en Firestore y envío de notificación por email.

**Criterios de Aceptación:**
- El formulario invoca un Server Action definido con `"use server"`.
- El Server Action realiza las siguientes operaciones en secuencia:
  1. **Validación del servidor:** Verifica que todos los campos requeridos están presentes y son válidos (nombre no vacío, email con formato válido, mensaje con longitud mínima). Si la validación falla, retorna un error al cliente.
  2. **Verificación anti-spam:** Comprueba que el campo honeypot está vacío.
  3. **Persistencia en Firestore:** Crea un nuevo documento en la colección `messages` con `status: "unread"` y el `received_at` como `serverTimestamp()`.
  4. **Envío de notificación:** Invoca el servicio de email (Resend SDK o Nodemailer) para enviar un email al administrador notificándole del nuevo mensaje. El email incluye: nombre del remitente, email del remitente, asunto y cuerpo del mensaje.
  5. **Retorno al cliente:** Devuelve `{ success: true }` para que el cliente muestre el mensaje de confirmación.
- Si el envío de email falla, la operación NO revierte la escritura en Firestore. El mensaje debe guardarse igualmente. El error de email se registra en los logs de Vercel.
- El servicio de email preferido es **Resend** (por su SDK moderno y excelente deliverability). Alternativa: Nodemailer con un relay SMTP (Gmail con App Password o SendGrid).
- Las credenciales del servicio de email se almacenan como variables de entorno en Vercel.

---

#### FR-INT-02 — Cron Job de GitHub Contributions

**Descripción:** Un job programado actualiza periódicamente los datos de contribuciones de GitHub en Firestore.

**Criterios de Aceptación:**
- El endpoint del Cron Job es una API Route de Next.js: `GET /api/cron/github`.
- El job se ejecuta automáticamente cada **24 horas** mediante Vercel Cron, configurado en `vercel.json`.
- El endpoint está protegido por un `CRON_SECRET` token que Vercel envía automáticamente en el header `Authorization`. Si el header no coincide, la ruta retorna `401 Unauthorized`.
- El job realiza las siguientes acciones:
  1. Consulta la API REST de GitHub (`https://api.github.com/users/{username}/contributions` o el endpoint de GraphQL de GitHub para obtener el contribution calendar con el detalle por día).
  2. Transforma los datos al esquema de `github_stats/contributions`.
  3. Sobrescribe el documento `github_stats/contributions` en Firestore usando `set()` (no `merge`).
  4. Registra en el log de Vercel la fecha y resultado de la ejecución.
- El job es también invocable manualmente desde el panel de administración (FR-ADM-06) con el mismo mecanismo de autenticación.
- Si la API de GitHub retorna un error, el job falla silenciosamente (no borra los datos existentes) y registra el error.

> **Nota técnica:** La API REST pública de GitHub no expone directamente el contribution calendar con los niveles. Se recomienda usar el endpoint GraphQL de GitHub (`api.github.com/graphql`) con el query `contributionsCollection`, que requiere un Personal Access Token (PAT) con scope mínimo `read:user`. Este token se almacena como variable de entorno `GITHUB_PAT`.

---

#### FR-INT-03 — Integración con Cloudinary para Subida de Imágenes

**Descripción:** El panel de administración utiliza el SDK de Cloudinary para Node.js para gestionar la subida y organización de activos multimedia.

**Criterios de Aceptación:**
- La subida de imágenes no ocurre directamente desde el cliente hacia Cloudinary (para no exponer el API secret). Sigue el flujo: `Client → Server Action → Cloudinary SDK → Cloudinary`.
- El Server Action recibe el archivo como `FormData`, lo procesa con el SDK de `cloudinary` para Node.js, y retorna la `secure_url`.
- El SDK de Cloudinary se configura con las variables de entorno: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- La carpeta de destino en Cloudinary se especifica en el parámetro `folder` del SDK, basada en el tipo de imagen que se sube.
- Se especifica en el upload el parámetro `resource_type: "image"` y `format: "webp"` para conversión automática donde sea posible.

---

#### FR-INT-04 — Revalidación Bajo Demanda del Caché ISR

**Descripción:** Cuando el administrador guarda cambios en el panel, el sistema invalida selectivamente el caché ISR de las rutas afectadas.

**Criterios de Aceptación:**
- Existe un endpoint protegido `POST /api/revalidate` que acepta un payload `{ path: string, secret: string }`.
- La petición solo es procesada si el `secret` del payload coincide con la variable de entorno `REVALIDATION_SECRET`.
- El endpoint ejecuta `revalidatePath(path)` de Next.js y retorna `{ revalidated: true, path }`.
- Las Server Actions del panel de administración invocan este endpoint (o llaman directamente a `revalidatePath` si están en el servidor) tras cada mutación exitosa de contenido.
- Rutas a revalidar por evento:
  - Modificación de cualquier documento en `content`: revalidar `/`.
  - Publicación/modificación/eliminación de un proyecto: revalidar `/` y `/projects/[slug]`.

---

## 6. Requerimientos No Funcionales (NFRs)

### 6.1 Rendimiento (Performance)

**NFR-PERF-01 — Puntuación Lighthouse:**
El sitio público debe obtener una puntuación mínima de **95/100** en todas las categorías de Lighthouse (Performance, Accessibility, Best Practices, SEO) en condiciones de red simulada de "Mobile - Fast 4G" y "Desktop".

**NFR-PERF-02 — Core Web Vitals:**
Los Core Web Vitals deben cumplir los umbrales "Good" de Google:
- **LCP (Largest Contentful Paint):** < 2.5 segundos.
- **FID / INP (Interaction to Next Paint):** < 200ms.
- **CLS (Cumulative Layout Shift):** < 0.1.

**NFR-PERF-03 — Tamaño del Bundle JavaScript:**
El bundle de JavaScript inicial para el sitio público (First Load JS) no debe exceder **150 KB** (comprimido con Brotli). Se debe implementar code splitting agresivo y los módulos del panel de administración deben estar completamente separados.

**NFR-PERF-04 — Optimización de Imágenes:**
Todas las imágenes deben ser servidas en formato WebP (o AVIF donde el soporte lo permita), con dimensiones apropiadas para el viewport del cliente. Se utilizará el componente `<Image />` de Next.js para las imágenes estáticas y URLs de Cloudinary con parámetros de transformación (`f_auto,q_auto,w_auto`) para las imágenes dinámicas.

**NFR-PERF-05 — Caché y TTL:**
- Las rutas ISR del sitio público tienen un `revalidate` de **3600 segundos** (1 hora) como máximo, aunque la revalidación bajo demanda es el mecanismo primario de actualización.
- Los assets estáticos (JS, CSS, fuentes) se sirven con headers de caché de largo plazo (`Cache-Control: public, max-age=31536000, immutable`) gracias al hashing de Vercel.

**NFR-PERF-06 — Fuentes Web:**
Si se utilizan fuentes web personalizadas, deben cargarse con `font-display: swap` y ser pre-cargadas con `<link rel="preload">`. Preferiblemente, se usarán fuentes del sistema o `next/font` para eliminar la latencia de red asociada a fuentes externas.

### 6.2 Seguridad (Security)

**NFR-SEC-01 — Variables de Entorno:**
Ningún secreto (API keys, credenciales de Firebase, API secrets de Cloudinary, etc.) debe ser expuesto en el código fuente o en el bundle del cliente. Todos los secretos se gestionan como variables de entorno en Vercel. Las variables accesibles en el cliente deben limitarse estrictamente a las prefijadas con `NEXT_PUBLIC_` y solo deben contener información no sensible (como el `projectId` de Firebase).

**NFR-SEC-02 — Reglas de Seguridad de Firestore:**
Las reglas de seguridad de Firestore deben implementar el principio de mínimo privilegio:
- Colección `content`: Lectura pública (`allow read: if true`). Escritura solo para usuarios autenticados y autorizados.
- Colección `projects`: Lectura pública solo para documentos con `status == "published"`. Lectura y escritura completa solo para usuarios autorizados.
- Colección `messages`: Creación pública (con validación de esquema estricta en la regla). Lectura y modificación solo para usuarios autorizados.
- Colección `github_stats`: Lectura pública. Escritura solo desde el servidor (Firebase Admin SDK, no desde el cliente).

**NFR-SEC-03 — Validación de Inputs:**
Todos los datos provenientes del usuario (formulario de contacto, campos del panel de administración) deben ser validados tanto en el cliente como en el servidor antes de ser persistidos. Se recomienda el uso de **Zod** para la definición de schemas de validación compartibles entre cliente y servidor.

**NFR-SEC-04 — Protección de Rutas del Admin:**
El middleware de Next.js debe interceptar todas las peticiones a `/admin/*` y verificar la autenticidad del token de sesión. Las reglas de Firestore actúan como segunda capa de defensa.

**NFR-SEC-05 — Headers de Seguridad HTTP:**
La aplicación debe configurar los siguientes HTTP Security Headers a través de `next.config.js`:
- `Content-Security-Policy` (CSP): Política restrictiva que permita solo los orígenes necesarios (Firebase, Cloudinary, el propio dominio).
- `X-Frame-Options: DENY` (previene clickjacking).
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy`: Deshabilita features no necesarias (camera, microphone, geolocation).

**NFR-SEC-06 — Protección Anti-CSRF:**
Las Server Actions de Next.js tienen protección CSRF incorporada. Para endpoints de API Routes que muten estado, se debe verificar el `Origin` header o implementar tokens CSRF.

**NFR-SEC-07 — Sanitización de Markdown:**
El contenido Markdown de los proyectos (`readme_content`) es renderizado con `react-markdown`. Se debe configurar `rehype-sanitize` para prevenir inyecciones XSS en el HTML generado a partir del Markdown.

### 6.3 Escalabilidad

**NFR-SCALE-01 — Independencia de Infraestructura:**
El sistema debe escalar automáticamente a través de la infraestructura de Vercel y Firebase sin intervención manual. Las funciones serverless de Next.js (Server Actions, API Routes) escalan horizontalmente de forma automática.

**NFR-SCALE-02 — Diseño como Template:**
El sistema de contenido (colección `content` en Firestore) debe ser lo suficientemente genérico para que un desarrollador diferente pueda adoptar el portfolio como template, cambiando únicamente el contenido en Firestore y las variables de entorno, sin modificar el código fuente de la aplicación. Los textos hardcodeados en el código deben ser eliminados a favor de variables consumidas desde Firestore.

**NFR-SCALE-03 — Indexación de Firestore:**
Para las consultas frecuentes (proyectos por `status` y `order`), se deben crear índices compuestos en Firestore para garantizar el rendimiento de las queries conforme crece el número de documentos.

### 6.4 Accesibilidad (Accessibility)

**NFR-A11Y-01 — Conformidad WCAG 2.1 Nivel AA:**
El sitio debe cumplir con las pautas WCAG 2.1 Nivel AA. Esto incluye:
- Ratio de contraste mínimo de **4.5:1** para texto normal y **3:1** para texto grande, sobre todos los fondos del sistema de diseño monocromático.
- Todos los elementos interactivos (botones, links, inputs) deben ser accesibles por teclado y tener estados de `focus` claramente visibles.
- Las imágenes decorativas tienen `alt=""` y las imágenes informativas tienen `alt` descriptivos.
- Los formularios tienen labels apropiados asociados a sus inputs (`<label for>` o `aria-label`).
- El HTML semántico se usa correctamente: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<h1>`-`<h6>` en orden jerárquico correcto.

**NFR-A11Y-02 — Movimiento Reducido:**
Todas las animaciones y transiciones deben respetar la media query `prefers-reduced-motion: reduce`. La animación de boot sequence en el Hero debe poder ser omitida.

**NFR-A11Y-03 — Landmarks y ARIA:**
Secciones que no tienen equivalente semántico HTML deben usar `role` ARIA apropiados. El grafo de GitHub debe incluir una descripción textual alternativa accesible.

### 6.5 SEO

**NFR-SEO-01 — Metadatos Completos:**
Todas las páginas públicas deben incluir: `<title>` único y descriptivo, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, `<meta property="og:url">`, `<meta name="twitter:card">`.

**NFR-SEO-02 — Datos Estructurados (Schema.org):**
Implementar JSON-LD para: `Person` (con `name`, `url`, `sameAs` para redes sociales, `jobTitle`) en la página raíz y `SoftwareApplication` o `CreativeWork` para cada proyecto.

**NFR-SEO-03 — Sitemap y Robots:**
Un `sitemap.xml` dinámico debe ser generado en `app/sitemap.ts` incluyendo todas las rutas públicas. Un `robots.txt` en `app/robots.ts` debe bloquear el acceso a `/admin`.

**NFR-SEO-04 — Canonicalización:**
Cada página debe incluir un `<link rel="canonical">` que apunte a su URL canónica (evitando contenido duplicado).

### 6.6 Mantenibilidad

**NFR-MAINT-01 — Estructura del Proyecto:**
El proyecto debe seguir las convenciones de directorio de Next.js App Router, con una organización lógica:

```
/app
  /(public)          → Layout y rutas públicas
    /projects/[slug]
    page.tsx         → Landing (secciones como componentes)
  /(admin)           → Layout protegido del admin
    /login
    /dashboard
    /content
    /projects
    /images
    /messages
  /api
    /cron/github
    /contact
    /revalidate
/components
  /ui                → Componentes atómicos de UI
  /sections          → Componentes de secciones de la landing
  /admin             → Componentes específicos del admin
/lib
  /firebase          → Inicialización Firebase Admin y Client
  /cloudinary        → Configuración y helpers de Cloudinary
  /email             → Templates y función de envío de email
  /validations       → Schemas Zod
/types               → Tipos e interfaces TypeScript globales
/hooks               → Custom React hooks
```

**NFR-MAINT-02 — TypeScript Estricto:**
El modo `strict: true` de TypeScript debe estar habilitado. No se permite el uso de `any` explícito en el código de producción. Se deben usar tipos explícitos para todos los documentos de Firestore.

**NFR-MAINT-03 — Documentación de Código:**
Las funciones públicas, Server Actions, hooks y tipos complejos deben tener JSDoc comentarios que expliquen su propósito, parámetros y retorno.

---

## 7. Estrategia de Despliegue y CI/CD

### 7.1 Flujo de Despliegue en Vercel

El proceso de CI/CD es gestionado por la integración nativa de Vercel con GitHub.

**Ambientes:**

| Ambiente | Branch | URL | Propósito |
|---|---|---|---|
| **Production** | `main` | `portfolio.dev` (custom domain) | Ambiente productivo. Tráfico real. |
| **Preview** | Cualquier PR | `*.vercel.app` (auto-generada) | Revisión de cambios antes de merge. |
| **Development** | Local | `localhost:3000` | Desarrollo local. |

**Flujo del Pipeline:**

```
Developer → git push / PR
       ↓
GitHub Repository
       ↓
Vercel CI Trigger (automático)
       ↓
┌─────────────────────────────────────┐
│ Vercel Build Process                │
│  1. Instalar dependencias (pnpm)    │
│  2. Type check (tsc --noEmit)       │
│  3. Lint (eslint)                   │
│  4. Build (next build)              │
│     - Ejecuta generateStaticParams  │
│     - Pre-genera rutas ISR          │
│     - Genera sitemap.xml            │
│  5. Deploy a Vercel CDN             │
└─────────────────────────────────────┘
       ↓
Vercel Preview URL (PRs) / Production URL (main)
       ↓
Notificación de estado en GitHub PR
```

**Configuración de `vercel.json`:**

```json
{
  "crons": [
    {
      "path": "/api/cron/github",
      "schedule": "0 4 * * *"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

> El Cron Job `0 4 * * *` ejecuta el job de GitHub a las 04:00 UTC diariamente.

### 7.2 Gestión de Variables de Entorno

Las variables de entorno se configuran en el dashboard de Vercel para cada ambiente por separado. **Nunca** deben ser commiteadas en el repositorio (el `.gitignore` debe incluir `.env*.local`).

**Variables de entorno requeridas:**

| Variable | Scope | Descripción |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client | API Key pública de Firebase. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client | Auth domain de Firebase. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client | Project ID de Firebase (no sensible). |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client | Storage bucket de Firebase. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client | Sender ID de Firebase. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client | App ID de Firebase. |
| `FIREBASE_ADMIN_PROJECT_ID` | Server | Project ID para Firebase Admin SDK. |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Server | Client email de la service account. |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Server | Private key de la service account (con `\n` escapados). |
| `CLOUDINARY_CLOUD_NAME` | Server | Nombre del cloud de Cloudinary. |
| `CLOUDINARY_API_KEY` | Server | API Key de Cloudinary. |
| `CLOUDINARY_API_SECRET` | Server | API Secret de Cloudinary. |
| `RESEND_API_KEY` | Server | API Key de Resend para envío de emails. |
| `EMAIL_ADMIN_TO` | Server | Email de destino para las notificaciones de contacto. |
| `GITHUB_USERNAME` | Server | Nombre de usuario de GitHub para el Cron. |
| `GITHUB_PAT` | Server | Personal Access Token de GitHub para la API GraphQL. |
| `CRON_SECRET` | Server | Secret token que Vercel envía en los Cron Jobs. |
| `REVALIDATION_SECRET` | Server | Secret para proteger el endpoint de revalidación. |
| `ADMIN_EMAILS` | Server | Lista de emails autorizados como admins (separados por coma). |

### 7.3 Cron Jobs

| Job | Endpoint | Schedule (UTC) | Propósito |
|---|---|---|---|
| GitHub Contributions Sync | `/api/cron/github` | `0 4 * * *` (04:00 diario) | Actualiza los datos del grafo de contribuciones en Firestore. |

El Cron Job de Vercel incluye automáticamente el header `Authorization: Bearer {CRON_SECRET}` en cada invocación. El endpoint debe verificar este token antes de ejecutar cualquier lógica.

### 7.4 Estrategia de Branching

Se adopta un flujo **GitHub Flow** simplificado:

- **`main`**: Rama de producción. Solo recibe merges vía Pull Request desde ramas de feature.
- **`feature/{nombre}`**: Ramas de desarrollo de nuevas funcionalidades. Ejemplo: `feature/admin-projects-crud`.
- **`fix/{nombre}`**: Ramas para corrección de bugs. Ejemplo: `fix/contact-form-validation`.
- **`chore/{nombre}`**: Ramas para tareas de mantenimiento. Ejemplo: `chore/update-dependencies`.

**Reglas de protección de la rama `main`:**
- Requiere al menos 1 Pull Request review antes del merge.
- Requiere que todos los checks de Vercel (build, lint, type check) pasen exitosamente.
- No se permite force-push directamente a `main`.

---

*Fin del documento SRS — Versión 1.0.0*

---

> **Control de cambios:**
>
> | Versión | Fecha | Autor | Descripción |
> |---|---|---|---|
> | 1.0.0 | 2026-06-07 | Lead Architect | Versión inicial del documento. |