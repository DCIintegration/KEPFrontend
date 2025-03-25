# Portal Web - Proyecto Next.js

Un portal web responsive con autenticación, panel de control y páginas de perfil.

## Características

- Diseño responsive con animaciones
- Flujo de autenticación con inicio de sesión
- Panel de control con navegación basada en tarjetas
- Página de perfil
- Soporte para modo claro/oscuro

## Empezando

### Requisitos previos

- Node.js 16.x o superior
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tunombre/portal-web.git
cd portal-web
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

4. Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

## Estructura del proyecto

- `/pages` - Páginas Next.js
- `/components` - Componentes reutilizables
- `/context` - Contexto de React para gestión de estado
- `/styles` - Estilos globales
- `/public` - Activos estáticos

## Autenticación

Este proyecto utiliza un flujo de autenticación simple con fines de demostración. En un entorno de producción, deberías integrar un servicio de autenticación adecuado.

Para probar, utiliza cualquier combinación de correo electrónico y contraseña.

## Despliegue

La forma más fácil de desplegar tu aplicación Next.js es utilizar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Más información

Para aprender más sobre Next.js, echa un vistazo a los siguientes recursos:

- [Documentación de Next.js](https://nextjs.org/docs) - aprende sobre las características y API de Next.js.
- [Aprende Next.js](https://nextjs.org/learn) - un tutorial interactivo de Next.js.

## Contribuciones

¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.