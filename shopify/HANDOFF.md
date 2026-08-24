# NaturCalm · PDP Menopausia — Contexto completo para retomar en otro chat

> Pegá este documento entero al inicio del chat nuevo. Contiene todos los IDs,
> decisiones, hallazgos técnicos y pendientes. Fecha: 2026-08-24.

---

## 1. Qué se pidió

Reconstruir la página de producto de **oshwellness.com/es/products/menopause-support**
como blueprint de arquitectura de conversión, pero con marca, copy e identidad
visual completamente nuevos para **NaturCalm · Apoyo para la Menopausia**.

Requisitos explícitos del cliente:
- Conservar la cantidad de secciones y la lógica CRO de la referencia (no simplificar).
- No copiar textos literales: "traducción conceptual" sección por sección.
- **No inventar** estudios, certificaciones, porcentajes, testimonios, premios ni
  cantidades de clientes. Lo que falte va como **placeholder claramente marcado**.
- Identidad propia: crema, blanco cálido, verde oliva/salvia, beige, tonos naturales.
  Tipografía moderna, elegante, muy legible. Sensación premium de wellness femenino.
- Mobile es **prioridad**.
- Implementación directa en Shopify, modular, sin romper nada existente.

---

## 2. Cuenta y tienda

| Dato | Valor |
| --- | --- |
| Tienda | `Mi tienda 3` |
| Dominio | `c4f6sn-mq.myshopify.com` |
| Plan | Basic |
| Moneda | ARS · Argentina · TZ −03 |
| Email | urichsan1@gmail.com |

### Themes

| Theme | GID | Rol |
| --- | --- | --- |
| `v-gomitas` | `gid://shopify/OnlineStoreTheme/178996281537` | **MAIN (publicado)** |
| **`NaturCalm — Menopausia (PDP)`** | `gid://shopify/OnlineStoreTheme/179576963265` | UNPUBLISHED ← **acá está todo el trabajo** |
| `Horizon` | `gid://shopify/OnlineStoreTheme/178609815745` | UNPUBLISHED |
| `pre-built-theme-alt-1` | `gid://shopify/OnlineStoreTheme/178610798785` | UNPUBLISHED |

El theme NaturCalm es un **duplicado exacto de `v-gomitas`** más los archivos nuevos.

**Preview:**
`https://c4f6sn-mq.myshopify.com/products/apoyo-para-la-menopausia?preview_theme_id=179576963265`

**Editor:**
`https://admin.shopify.com/store/c4f6sn-mq/themes/179576963265/editor`

### Productos

| Producto | GID | Handle | Estado |
| --- | --- | --- | --- |
| **APOYO PARA LA MENOPAUSIA** | `gid://shopify/Product/11050777706689` | `apoyo-para-la-menopausia` | ACTIVE · **es el producto de trabajo** |
| Apoyo para la Menopausia | `gid://shopify/Product/11050785439937` | `naturcalm-equilibrio` | ACTIVE · **duplicado a archivar** |
| Líbrate De La Hinchazón… V-Gummies | `gid://shopify/Product/11009900544193` | `luzyna-drenaje-linfatico` | DRAFT |

Producto de trabajo, detalle:
- Precio **39.990 ARS**, sin `compareAtPrice`.
- **Una sola variante**: `gid://shopify/ProductVariant/50523083636929` ("Default Title"), 47 unidades.
- **4 imágenes** cargadas (1254×1254 px).
- Cambios ya aplicados: `vendor` → `NaturCalm`, `templateSuffix` → `naturcalm`.

El duplicado `naturcalm-equilibrio` tiene 0 stock, sin imágenes y un `<iframe>`
en la descripción de un intento anterior. **No fue tocado** — conviene archivarlo.

---

## 3. Cómo es el theme base (importante)

`v-gomitas` es un theme tipo *Shrine / section-pack*: ~150 secciones con prefijo
`sp-*` y un `sections/main-product.liquid` de **286 KB** con bloques muy potentes.

Bloques disponibles en `main-product` (verificados en uso):
`title`, `rating_stars`, `text`, `variant_picker`, `quantity_selector`
(con `enable_quantity_discounts`), `buy_buttons`, `shipping_checkpoints`,
`sticky_atc`, `description`, `reviews`, `collapsible_tab`.

**Decisión de arquitectura:** el buy box NO se reescribió. Se reutiliza
`main-product` configurado con estilo NaturCalm, así el carrito, el sticky ATC,
las ofertas por cantidad y los acordeones siguen siendo nativos del theme.
Todo lo demás son secciones nuevas.

Templates de producto existentes: `templates/product.json` (30 KB, del producto
V-Gummies) — **no fue modificado**.

---

## 4. Identidad visual NaturCalm

Definida en `assets/naturcalm.css` como custom properties sobre `.nc`:

```
--nc-cream      #FBF7F0   fondo principal
--nc-cream-2    #F5EFE4   fondo alterno
--nc-sand       #EDE4D5   beige
--nc-linen      #FFFDF9   tarjetas
--nc-olive      #6E7C55   acento
--nc-olive-deep #46512F   botones y banda oscura
--nc-sage       #B7C3A8
--nc-sage-pale  #E4EADC   tags, badges, tarjeta CTA
--nc-clay       #C6A084
--nc-rose       #C2867E   /  --nc-rose-pale #F6E9E5  (placeholders)
--nc-ink        #2C2A25   texto
--nc-ink-soft   #56524A   /  --nc-muted #7A7469
--nc-line       #E4DACA   /  --nc-line-soft #EFE8DC
```

Tipografía (Google Fonts, vía `@import` en el CSS):
- Títulos: **Cormorant Garamond** (serif, 500/600)
- Cuerpo: **Inter** (300/400/500/600)

Layout: `--nc-max: 1180px`, radios 18/12px, botones pill, sombras suaves.
**Mobile-first**: la base es 1 columna; los breakpoints suben a 2 columnas en
`750px` y a la grilla final en `990px`. Cada sección expone padding separado
para desktop y mobile.

---

## 5. Archivos creados (todos ya subidos al theme NaturCalm)

Repo: `github.com/urichsan1-star/claude-1` (**público**),
rama `claude/naturcalm-shopify-product-page-09ehyw`, carpeta `shopify/`.
Último commit: `64df789c42a5e3c0c875ac384b296f740824c820`.

| Archivo del theme | Bytes | Nombre en el editor | Función CRO |
| --- | --- | --- | --- |
| `assets/naturcalm.css` | 22207 | — | Design system completo |
| `sections/nc-press-bar.liquid` | 2762 | 🌿 NC · Prensa | Autoridad prestada |
| `sections/nc-problem.liquid` | 5307 | 🌿 NC · Problema | Auto-identificación |
| `sections/nc-stats.liquid` | 4310 | 🌿 NC · Cifras | Respaldo racional |
| `sections/nc-ingredients.liquid` | 7408 | 🌿 NC · Ingredientes | Transparencia + deseo |
| `sections/nc-purpose.liquid` | 4023 | 🌿 NC · Propósito | Confianza afectiva |
| `sections/nc-mechanism.liquid` | 5391 | 🌿 NC · Cómo funciona | Mecanismo, justifica precio |
| `sections/nc-experts.liquid` | 4212 | 🌿 NC · Especialistas | Autoridad profesional |
| `sections/nc-comparison.liquid` | 6098 | 🌿 NC · Comparación | Diferenciación + CTA |
| `sections/nc-ritual.liquid` | 4374 | 🌿 NC · Cómo usarlo | Baja fricción de uso |
| `sections/nc-faq.liquid` | 6519 | 🌿 NC · FAQ | Barrido de objeciones |
| `sections/nc-cta-band.liquid` | 4624 | 🌿 NC · CTA final | Cierre con garantías |
| `sections/nc-reviews.liquid` | 5363 | 🌿 NC · Reseñas | Prueba social |
| `sections/nc-disclaimer.liquid` | 2999 | 🌿 NC · Descargos | Seriedad legal |
| `templates/product.naturcalm.json` | 37462 | — | Arma las 14 secciones |

Cada sección: `{% schema %}` propio con settings, blocks y preset; carga el CSS con
`{{ 'naturcalm.css' | asset_url | stylesheet_tag }}`; expone colores y paddings
editables. El FAQ usa `<details>/<summary>` nativo — **cero JavaScript**.

Sobra un archivo: **`templates/product.nctest.json`** (198 bytes), usado para
diagnóstico. La API bloquea borrar archivos de theme — hay que borrarlo desde el
admin. Es inofensivo (template alterno sin usar).

---

## 6. Orden de la página (mapeo contra la referencia)

| # | Sección | Equivale en OSH a |
| --- | --- | --- |
| 1 | `main` (main-product) | Buy box: título, estrellas, bullets, ofertas, ATC, envíos, sticky, 4 acordeones |
| 2 | `nc_press` | Barra Cosmopolitan / WebMD / Forbes / MSN |
| 3 | `nc_problem` | "Para mujeres que no dejan que la edad las defina" |
| 4 | `nc_stats` | Banda 87% / 72% / 36% / 200+ |
| 5 | `nc_ingredients` | "Ingredientes ayurvédicos 100% orgánicos" |
| 6 | `nc_purpose` | "Por qué hacemos lo que hacemos" |
| 7 | `nc_mechanism` | Banda oscura "Cómo esta fórmula ayuda a…" |
| 8 | `nc_experts` | "Con la confianza de expertos en salud femenina" |
| 9 | `nc_comparison` | "La diferencia de Osh" + CTA |
| 10 | `nc_ritual` | Contenido del acordeón "Uso sugerido", elevado a sección |
| 11 | `nc_faq` | "¿Preguntas? ¡Las tenemos cubiertas!" |
| 12 | `nc_cta` | "OBTÉN APOYO PARA LA MENOPAUSIA" |
| 13 | `nc_reviews` | "Mujeres Reales. Opiniones Reales." |
| 14 | `nc_disclaimer` | Exenciones + referencias de investigación |

**El producto con CTA reaparece 4 veces**: buy box, después de la comparación,
CTA final y sticky ATC permanente.

### Configuración del buy box

- `rating_stars`: 5 estrellas, label `[N] RESEÑAS VERIFICADAS — COMPLETAR`.
- `text`: 3 bullets con `check_circle`, en caja beige `#F5EFE4`, layout vertical.
- `quantity_selector`: 3 tramos — 1 frasco / **2 frascos (preseleccionado, "EL MÁS ELEGIDO")** /
  3 frascos ("MEJOR VALOR"). **Con 0% de descuento**: hoy es precio × cantidad.
- `buy_buttons`: color `#46512F`.
- `shipping_checkpoints`: TU PEDIDO → DESPACHO (1-2 d) → EN TU CASA (3-7 d), en español.
- `sticky_atc`: aparece al scrollear, **ancho completo en mobile**.
- 4 `collapsible_tab`: Modo de uso · Composición · Sin hormonas · Envíos y devoluciones.
- `hide_variants: true` (el producto tiene una sola variante).

---

## 7. Hallazgos técnicos (esto ahorra MUCHO tiempo)

1. **`themeFilesUpsert` con `body.type: URL` falla en silencio.** Si el archivo no
   pasa validación, devuelve `upsertedThemeFiles: []` y `userErrors: []` — sin error.
   Para ver el error real hay que subir con `body.type: TEXT`.
2. **Escrituras al theme MAIN bloqueadas** por la política del MCP. Por eso se
   trabajó sobre un duplicado (`themeDuplicate`, payload `newTheme`, no `theme`).
3. **`themeFilesDelete` está bloqueado por completo.** Borrar archivos solo desde el admin.
4. **Schema `range`**: el `default` debe cumplir `(default - min) % step == 0`.
   Un `step: 4` con `default: 90` rompe la subida. Todas las secciones usan `step: 2`.
5. **Shopify valida los settings del JSON template contra el schema de la sección.**
   Restricciones halladas en `main-product`: márgenes en **paso 3**;
   `column_gap` máx **6**; `padding` máx **5**. Valores conocidos que funcionan:
   `icon_scale 120`, `icon_spacing 10`, `image_width 100`, `border_radius 10`,
   `thumbnails_count 5`, paddings de sección múltiplos de 4.
6. **Liquid no permite aplicar un filtro al argumento de otro filtro.**
   `alt: image.alt | default: heading` aplica `default` a la salida de `image_tag`.
   Hay que hacer `{%- assign nc_alt = … -%}` antes.
7. **La política de red de la sesión bloquea `cdn.shopify.com` y el dominio de la
   tienda** (CONNECT 403). No se pudieron descargar las imágenes del producto ni
   abrir el preview. **La página nunca fue verificada visualmente.**
8. **`raw.githubusercontent.com` sí es alcanzable desde el servidor de Shopify**,
   así que subir por URL desde el repo público funciona para archivos válidos.

---

## 8. Pendientes antes de publicar

**Placeholders a completar** (todos marcados en el texto con `[corchetes]` o ⚠︎):

1. **Cifras** — los 4 números están en `[00%]` resaltados en rosa. Completar con
   datos propios verificables o eliminar la sección.
2. **Reseñas** — 3 bloques vacíos + puntaje `[0,0] de 5` y `[N] reseñas`.
   Cargar reales o conectar Judge.me / Loox / Shopify Reviews.
3. **Especialistas** — 2 perfiles de ejemplo. Requieren autorización escrita.
4. **Dosis por porción** de los 6 botánicos + composición completa (ficha técnica).
5. **Envíos, cambios y devoluciones** — aparece en 4 lugares.
6. **Email de contacto** (hoy `hola@naturcalm.com`, placeholder) en el FAQ.
7. **Registro sanitario** y leyendas obligatorias en Descargos.
8. **Cantidad de cápsulas por toma** y días de tratamiento por frasco.
9. **Imágenes**: prensa, foto de cada botánico, imagen de problema, de marca,
   de mecanismo, de FAQ, pasos del ritual, avatares. Todas caen en un placeholder
   rayado si están vacías.
10. **Links de los botones** (`button_link`) — vacíos; conviene apuntarlos al
    ancla del buy box o a `/cart/add`.

**Decisión comercial pendiente:** las ofertas 2× y 3× están **sin descuento
real**. Si se quiere mostrar ahorro, hay que crear descuentos por cantidad en
Shopify; poner un "% off" solo en el theme mostraría un precio que el checkout
no aplica.

**Limpieza:** archivar el producto duplicado `naturcalm-equilibrio` y borrar
`templates/product.nctest.json` desde el admin.

**Nota sobre el template:** `templateSuffix` es propiedad del producto, no del
theme. Mientras `v-gomitas` siga publicado, esa página cae al template de producto
por defecto (Shopify hace fallback si el template no existe). El diseño nuevo se
ve en el preview y pasa a producción al publicar el theme NaturCalm.

---

## 9. Cómo seguir trabajando

Para modificar una sección: editar el archivo en `shopify/sections/` del repo,
commitear, pushear, y subir con:

```graphql
mutation Upsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
  themeFilesUpsert(themeId: $themeId, files: $files) {
    upsertedThemeFiles { filename size }
    userErrors { filename code message }
  }
}
```

con `themeId: "gid://shopify/OnlineStoreTheme/179576963265"` y
`body: { type: "URL", value: "https://raw.githubusercontent.com/urichsan1-star/claude-1/<SHA>/shopify/<ruta>" }`.

**Siempre verificar después** consultando `theme(id:){ files(filenames:[…]){ nodes { filename size } } }`
y comparando bytes contra el archivo local — porque la subida por URL falla en silencio.
