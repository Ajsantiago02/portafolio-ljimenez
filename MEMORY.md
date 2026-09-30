# MEMORY — Portafolio Luis Armando Jiménez Santiago

Estado y control de cambios del portafolio. **Leer antes de modificar `index.html`.**

## Qué es este proyecto

Landing page de una sola página. HTML5 semántico + Tailwind CSS (CDN), CSS propio en
`assets/css/styles.css`, JS propio en `assets/js/main.js`. Tema claro/oscuro con toggle.

No hay build step, no hay package.json. Se despliega tal cual (GitHub Pages).

## Estructura de `index.html`

| Sección | `id` | Línea aprox. |
|---|---|---|
| Header / Navbar | — | 90-175 |
| Hero | `inicio` | 177 |
| Perfil | `perfil` | 309 |
| Proyectos | `proyectos` | 412 |
| Constancias y formación | `certificaciones` | 658 |
| Modal de certificados | `cert-modal` | 1050 |
| Habilidades | `habilidades` | ~1150 |
| Trayectoria | `trayectoria` | ~1200 |
| Contacto | `contacto` | ~1290 |

Los números de línea cambian con cada edición: verificar con `grep -n 'section id=' index.html`.

## Clasificación de `assets/certs` (VERIFICADA con pdftotext)

19 PDFs. Todos están referenciados en la sección `#certificaciones`. Verificado: 0 rutas rotas,
0 huérfanos, 0 duplicados.

### Grupo 1 — Cursos y certificaciones (7)

| Archivo | Título real | Emisor | Horas | Fecha |
|---|---|---|---|---|
| `2828_santiagoluis28394@gmail.com.pdf` | Domina la IA con Gemini | — | 2 h | 29 jul 2026 |
| `2829_santiagoluis28394@gmail.com.pdf` | Google: IA Práctica para Marketing | — | 2 h | 20 ago 2026 |
| `4007_santiagoluis28394@gmail.com.pdf` | IA y responsabilidad: creación de una IA positiva | — | 2 h | 27 ago 2026 |
| `035fdb60-...-58799cdb4817_certificado.pdf` | Crea la identidad de tu negocio | Capacítate para el Empleo | 40 h | 12-17 ago 2026 |
| `3695fb08-...-be24b9a1449d_certificado.pdf` | Postprocesadores de estilo | Capacítate para el Empleo | 13 h | 4-12 ago 2026 |
| `d6a7a9be-...-bf02b06dfa59_certificado-1.pdf` | Representante telefónico | Capacítate para el Empleo | 28 h | 30 ago 2023 |
| `04ac0c3f-...-1b4d97f69bfb_certificado-1.pdf` | Seguridad y privacidad en el manejo de información (Regulación) | Capacítate para el Empleo | 10 h | 30 ago 2023 |

### Grupo 2 — Constancias de diseño gráfico (9)

Los archivos `Luis Armando Jiménez Santiago-N.pdf` **NO son cursos**. Son constancias de
elaboración y presentación de **carteles**, todas de la **misma convocatoria**:
*Dirección General de Educación Superior para el Magisterio y Redes Escolares (SEP)*,
Convocatoria «Conmemoración de Fechas Ambientales», CDMX, 23 feb 2026.

El número del archivo **no** sigue el orden de las fechas. Mapa real:

| Fecha conmemorativa | Archivo |
|---|---|
| 22 de marzo — Día Mundial del Agua | `-8.pdf` |
| 22 de abril — Día Internacional de la Madre Tierra | `-9.pdf` |
| 17 de mayo — Día Mundial del Reciclaje | `-1.pdf` |
| 20 de mayo — Día Mundial de los Polinizadores | `-2.pdf` |
| 22 de mayo — Día de la Diversidad Biológica | `-3.pdf` |
| 5 de junio — Día Mundial del Medio Ambiente | `-4.pdf` |
| 8 de junio — Día Mundial de los Océanos | `-5.pdf` |
| 28 de junio — Día Mundial del Árbol | `-6.pdf` |
| 3 de julio — Día Mundial Libre de Bolsas de Plástico | `-7.pdf` |

### Grupo 3 — Otros documentos (3, PENDIENTES)

PDFs **escaneados, sin capa de texto** (`pdftotext` no devuelve nada). No se les inventó
título: se muestran como "por identificar". Hay que abrirlos a ojo y CONFIRMAR con el usuario.

| Archivo | Lo que se sabe |
|---|---|
| `AWSseptiembre.pdf` | Por el nombre parece AWS. Creado 25 sep 2026. Sin título ni metadatos. |
| `Certificado-Luis-Armando-Jimenez-Santiago-g2c07vaq.pdf` | Creado 14 jul 2026. 8.8 MB (es imagen). |
| `Certificado-Luis-Armando-Jimenez-Santiago-tly8efaq.pdf` | Creado 4 sep 2026. 9.2 MB (es imagen). |

## Decisión clave: nunca inventar contenido

Antes de este trabajo la sección tenía **9 tarjetas con datos fabricados**: "Brais Moure",
"CCNUBIO", "Programación Web Avanzada", "Introducción a Web Services", "Prompting Responsable",
"Cursor con Python", "Administrador de Plataformas Digitales", "Python", "Desarrollo de IA:
Programa con Agentes" — ninguna existía en los PDFs, y todas apuntaban a los constancias de
carteles. **Todo eso se eliminó.** Regla: si el dato no sale del PDF, no se escribe.

## Cómo abrir una tarjeta de certificado

`index.html`:

```html
<article class="cert-card reveal" data-cert-url="assets/certs/ARCHIVO.pdf" tabindex="0" role="button" aria-label="Ver constancia: TITULO">
  <div class="cert-badge">Cartel</div>
  <div class="cert-content">
    <h3 class="cert-title">TITULO</h3>
    <p class="cert-instructor">EMISOR · DURACION · FECHA</p>
    <p class="cert-desc">DESCRIPCION</p>
    <ul class="cert-skills"><li>TAG</li><li>TAG</li><li>TAG</li></ul>
  </div>
  <span class="cert-click-hint" aria-hidden="true">Click para ver</span>
</article>
```

`assets/js/main.js` (función `initCertModal`, ~línea 568) lee `.cert-badge`, `.cert-title`,
`.cert-instructor`, `.cert-desc`, `.cert-skills li` y `data-cert-url`, y los vuelca en el modal.
Si se agrega un campo nuevo hay que tocar también el JS.

Clases CSS útiles: `.cert-card`, `.cert-badge`, `.cert-title`, `.cert-instructor`, `.cert-desc`,
`.cert-skills`, `.cert-click-hint`, `.section-title`, `.eyebrow`, `.text-gradient`, `.reveal`,
`.reveal-delay-1`, `.reveal-delay-2`.

**Codificar la URL**: espacios → `%20`, acentos → UTF-8 (`é` = `%C3%A9`), `@` → `%40`.
El JS no codifica; pone el valor crudo en `href`.

## Problema conocido (preexistente, NO tocar sin avisar)

`index.html` tiene un error de anidamiento de etiquetas heredado de antes de este trabajo:

```
esperaba </div>    (abierto ~línea 985)
esperaba </section> (abierto ~línea 984)
```

Un `<div>` y un `<section>` quedan sin cerrar antes de `</main>`. Ya existía en el commit
`376f913`; este trabajo no lo introdujo ni lo corrigió. **No usar el parser HTML como
verificador de regresión** sin tener esto en cuenta: comparar contra el original.

## Carpeta duplicada

`cosntacias/` (typo de "constancias") en la raíz contiene 10 PDFs que ya están en
`assets/certs/`. Son copias, no originales. Está en git. **Pendiente de decidir con el
usuario**: borrar la carpeta o conservarla. No borrar sin preguntar.

## Referencias externas (del CV)

- https://artdesignlucka.github.io/branding/
- https://ajsantiago02.github.io/nails/
- https://github.com/Ajsantiago02/template-lj
- https://pdf.finkok.com/
- https://manpower.finkok.com/
- https://herbalife.finkok.com/iniciar-sesion/?next=/
- CV en PDF: `assets/cv-santiago-jimenez.pdf`

## Comandos de verificación

```bash
# Qué hay realmente en los PDFs (no confiar en los nombres de archivo)
pdftotext -layout "assets/certs/ARCHIVO.pdf" -

# Listar secciones y líneas
grep -n 'section id=\|data-cert-url' index.html

# Validar que toda URL de data-cert-url existe en disco
python3 - <<'PY'
import re, urllib.parse
from pathlib import Path
disk = {p.name for p in Path('assets/certs').iterdir() if p.suffix.lower()=='.pdf'}
html = Path('index.html').read_text(encoding='utf-8')
urls = re.findall(r'data-cert-url="([^"]+)"', html)
bad = [u for u in urls if urllib.parse.unquote(u.split('/')[-1]) not in disk]
print(len(urls), "tarjetas |", len(bad), "rotas", bad)
print("huérfanos:", sorted(disk - {urllib.parse.unquote(u.split('/')[-1]) for u in urls}))
PY
```

## Pendientes

- [ ] Confirmar título real de los 3 PDFs escaneados del Grupo 3.
- [ ] Decidir qué hacer con la carpeta duplicada `cosntacias/`.
- [ ] Corregir el error de anidamiento de la línea ~985 (preexistente).
- [ ] Considerar miniaturas (thumbnails) de los carteles en el Grupo 2 en vez de solo abrir el PDF.
