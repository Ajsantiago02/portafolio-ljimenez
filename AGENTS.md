Actúa como un desarrollador web Frontend experto.

Toma la información de mi CV que adjunto a continuación y genera el código HTML5 semántico y estilizado con Tailwind CSS para un portafolio web de una sola página (landing page), moderno, limpio y completamente responsivo (adaptable a celulares y computadoras).

El portafolio debe incluir las siguientes secciones:
1. Header / Navbar con enlaces de navegación suaves.
2. Hero Section: Nombre, título profesional, breve resumen de valor y un botón de llamada a la acción (CTA) "Ver proyectos" y "Descargar CV".
3. Proyectos Destacados: Tarjetas bien presentadas con título, descripción del reto/solución, etiquetas de tecnologías usadas y botones para "Ver Demo" y "Código".
4. Habilidades Técnicas: Organizadas visualmente por categorías.
5. Experiencia / Trayectoria: Formato de línea de tiempo o tarjetas limpias.
6. Contacto: Un formulario sencillo y enlaces a redes/contacto directo.

Asegúrate de usar un esquema de colores moderno (modo oscuro o tonos limpios) y código bien comentado.

el CV esta en esta ruta puedes usar los enlaces de mis paginas actuales


https://artdesignlucka.github.io/branding/

https://ajsantiago02.github.io/nails/

https://github.com/Ajsantiago02/template-lj
y por ejmplo paginas en las que he trabajdo 


https://pdf.finkok.com/


https://manpower.finkok.com/


https://herbalife.finkok.com/iniciar-sesion/?next=/


---

# Reglas de trabajo para este repositorio

## Leer primero
`MEMORY.md` contiene el estado real del proyecto, el mapa de `assets/certs/` y los problemas
conocidos. Leerlo **antes** de tocar `index.html`.

## Datos de la sección de constancias y certificados

La sección `#certificaciones` de `index.html` está construida con datos **verificados** extrayendo
el texto de cada PDF con `pdftotext`. Quedó organizada en **dos grupos**:

1. **Cursos y certificaciones** (10) — tarjetas `.cert-card` con modal. Cursos de IA, marca,
   estilo, seguridad y atención al cliente, más los 3 que el usuario confirmó leyendo a mano
   (Big School/MoureDev x2 y la constancia del curso de AWS).
2. **Constancias de diseño gráfico** (9) — los archivos `Luis Armando Jiménez Santiago-N.pdf`.
   **OJO: no son cursos.** Son constancias de elaboración y presentación de carteles de la
   convocatoria «Conmemoración de Fechas Ambientales» de la SEP, 23 feb 2026. El número del
   archivo no sigue el orden de las fechas; el mapa está en `MEMORY.md`.
   Se muestran como **lista compacta con enlace directo al PDF**, no como tarjetas con modal.

## Regla principal: nunca inventar contenido

No escribir títulos, emisores, fechas, horas o descripciones que no salgan del PDF. Antes de
agregar o corregir una tarjeta, extraer el dato real:

```bash
pdftotext -layout "assets/certs/ARCHIVO.pdf" -
```

Este proyecto ya tuvo tarjetas con datos fabricados ("Brais Moure", "CCNUBIO",
"Programación Web Avanzada", "Prompting Responsable", etc.) que no existían en ningún PDF.
Se eliminaron. No reintroducir ese patrón.

Si el PDF no tiene texto extraíble, dejarlo como "por identificar" y preguntar al usuario.
Nunca adivinar. Cuando el usuario lo confirme a mano, dejarlo anotado en `MEMORY.md` como
**dato del usuario**, no como dato extraído del PDF.

## Otros documentos del proyecto

- Sin build step, sin `package.json`. Se despliega tal cual (GitHub Pages).
- Editar con cambios pequeños y verificables; evitar reescrituras masivas de `index.html`
  (94 KB, 1331 líneas) porque los bloques largos fallan al no coincidir exactamente.
  Para reemplazar una sección completa, lo más seguro es un script de Python que corte por
  números de línea, no un editor de texto.
- Rutas dentro de `data-cert-url`: codificar espacios (`%20`), acentos (`%C3%A9`) y `@` (`%40`).
  El JS no codifica, asigna el valor crudo al `href`.
- Clases CSS reutilizables: `.cert-card`, `.cert-badge`, `.cert-title`, `.cert-instructor`,
  `.cert-desc`, `.cert-skills`, `.section-title`, `.eyebrow`, `.text-gradient`, `.reveal`.
- Al agregar un campo nuevo a una tarjeta hay que actualizar también `initCertModal()`
  en `assets/js/main.js`, que es lo que lee el DOM y llena el modal.

## Antes de terminar cualquier cambio

```bash
grep -n 'section id=' index.html          # confirmar que las secciones siguen en orden
git diff --stat                         # ver el alcance real de lo modificado
```

Y validar que toda URL de `data-cert-url` exista en disco con el script de `MEMORY.md`.

Nota: `index.html` tiene un error de anidamiento **preexistente** (~línea 920, un `div` y un
`section` sin cerrar). No fue introducido por estos cambios. Si se corrige, avisar al usuario
antes, porque puede alterar el layout.
