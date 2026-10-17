# Un ratito

Una PWA personal de tareas, en español. Sin backend, cuentas, bibliotecas externas ni pasos de compilación. Incluye filtros, progreso, borrado, guardado local y copias JSON para trasladar las tareas manualmente.

## Abrir y desarrollar desde Windows

1. Extrae el ZIP y abre la carpeta `un-ratito` en tu editor.
2. Con Python instalado, abre una terminal en esa carpeta y ejecuta `py -m http.server 8080 --bind 127.0.0.1`.
3. Abre http://localhost:8080 en el navegador. Detén el servidor con Ctrl+C.

También puedes usar la extensión Live Server de VS Code. Edita `index.html`, `style.css` y `app.js`. No abras el HTML con doble clic: `file://` no permite probar correctamente el service worker. El servidor de desarrollo solo sirve los archivos estáticos; la app no necesita backend.

## Publicarla gratis con HTTPS: GitHub Pages

1. Crea una cuenta gratuita de GitHub y un repositorio **público**, por ejemplo `un-ratito`.
2. Sube **el contenido** de esta carpeta a la raíz del repositorio. `index.html` debe quedar en la raíz, con `icons/` a su lado; no subas el ZIP entero. Incluye `.nojekyll` si utilizas Git.
3. Ve a **Settings → Pages → Build and deployment**. En **Source**, elige **Deploy from a branch**. Selecciona **main** y **/(root)** y guarda.
4. Espera a que GitHub muestre la dirección de la web, normalmente `https://TU-USUARIO.github.io/un-ratito/`. Abre esa URL y comprueba que esté activado **Enforce HTTPS**, si el ajuste está disponible.

El código será público; tus tareas no se suben al repositorio ni al servidor. Evita incluir información personal dentro de los archivos de código. La URL es accesible a quien la conozca, pero cada navegador tiene su propia lista. El proveedor de alojamiento puede registrar las visitas. No necesitas dominio propio ni cuenta de desarrollador de Apple.

## Instalarla en el iPhone

1. Abre la **URL HTTPS publicada** en **Safari**. La dirección `localhost` de Windows no sirve para abrirla desde el iPhone.
2. Pulsa **Compartir → Añadir a pantalla de inicio**. Según tu versión de iOS, Compartir puede estar dentro del menú de Safari. Si aparece, activa **Abrir como app web** y pulsa **Añadir**.
3. Abre **Un ratito** desde su icono con internet. Despliega «Tu app, siempre a mano» y espera al mensaje **Lista para usar sin conexión**.
4. Cierra la app, activa el modo avión y vuelve a abrirla desde el icono. Prueba a crear una tarea y vuelve a abrir la app para comprobar el guardado en tu iPhone.

La primera carga necesita internet para descargar los archivos. Después, el service worker permite abrir la app sin conexión. iOS puede liberar almacenamiento: el modo offline y las tareas no sustituyen una copia de seguridad.

## Tus datos y copias

Las tareas se guardan en `localStorage` del navegador/app y de esta dirección web. **No se sincronizan entre Windows y el iPhone**, ni se garantiza compartir datos entre Safari y la app instalada. Empieza a añadir tus tareas desde el icono instalado. Cambiar el dominio, borrar datos del sitio o desinstalar puede dejarte sin tus tareas.

En «Tu app, siempre a mano», pulsa **Guardar copia** para descargar un JSON. Usa **Importar copia** para recuperarlo en otro dispositivo; la importación sustituye la lista tras pedir confirmación. Haz copias si quieres conservarla. No guardes datos sensibles en esta demostración.

## Actualizar la app

Edita los archivos, cambia `CACHE` en `sw.js` (por ejemplo, de `v1` a `v2`) y vuelve a subirlos al mismo repositorio. Si añades archivos necesarios offline, agrégalos a `ASSETS`. Abre la app con internet para descargar la actualización; cierra todas sus ventanas y pestañas y vuelve a abrirla para activar la nueva versión. El guardado local se conserva mientras mantengas el mismo origen y la clave de almacenamiento.

## Archivos

- `index.html`: pantalla y metadatos para iPhone.
- `style.css`: diseño responsive y zonas seguras.
- `app.js`: tareas, filtros, guardado y copias.
- `manifest.webmanifest`: identidad e instalación de la PWA.
- `sw.js`: caché de los archivos para abrir sin conexión.
- `icons/`: PNG de 192 y 512 px, icono maskable y apple-touch-icon de 180 px.

## Fuentes oficiales

- Apple: https://support.apple.com/en-lamr/guide/iphone/iphea86e5236/ios
- Publicar con GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- HTTPS en GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
