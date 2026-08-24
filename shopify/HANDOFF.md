# NaturCalm · PDP Menopausia — Contexto y arranque en Claude Code local

> **v3 · 2026-08-24.** Reemplaza las versiones anteriores. Pegá este documento como
> primer mensaje en una sesión de Claude Code abierta **dentro de la carpeta del repo**.
>
> Qué cambia respecto de la v2: el arranque (§0) y el flujo de trabajo (§10) ahora usan el
> **Shopify CLI local** con los comandos corregidos. El contenido de negocio y arquitectura
> (§1–§8) no cambió. Se agrega el **checklist de verificación visual** (§9), que es el
> único paso del proyecto que nunca se pudo ejecutar.

---

## 0. Arranque en local

### 0.1 · Alcance de lectura (leer esto primero)

Claude Code lee **la carpeta desde la que lo abrís**, más lo que le indiques
explícitamente. No ve el resto del disco. Para mantener el alcance acotado, cloná el repo
en un directorio dedicado y abrí Claude Code ahí — no en `~` ni en una carpeta que tenga
otros proyectos mezclados:

```bash
mkdir -p ~/naturcalm && cd ~/naturcalm
git clone https://github.com/urichsan1-star/claude-1.git
cd claude-1
git checkout claude/naturcalm-shopify-product-page-09ehyw
```

Todo lo que sigue asume que estás parado en esa carpeta.

### 0.2 · Instalar el CLI

```bash
npm install -g @shopify/cli        # última versión al 2026-08-24: 4.7.0
shopify version
```

### 0.3 · Autenticación sin navegador (recomendado)

En vez de `shopify auth login` (que abre un browser), instalá la app **Theme Access** en
la tienda, generá una contraseña para `c4f6sn-mq.myshopify.com` y exportala:

```bash
export SHOPIFY_CLI_THEME_TOKEN="shptka_xxxxxxxxxxxxxxxx"
```

Con esa variable puesta, todos los comandos `shopify theme *` funcionan sin login
interactivo. Si preferís el flujo de navegador, `shopify auth login` también sirve.

### 0.4 · Confirmar la sintaxis de los flags

Este documento se escribió desde un entorno **sin acceso a `shopify.dev` y sin poder
instalar el CLI**, así que los comandos están basados en uso conocido, no verificados
contra la documentación. Antes de la primera corrida:

```bash
shopify theme pull --help
shopify theme push --help
```

Si algún flag difiere, ajustalo y **corregí este documento**.

### 0.5 · Traer el theme completo

`shopify/` en el repo **no es un theme válido por sí solo** — le faltan `config/`,
`layout/`, `locales/`, `snippets/`. Hay que bajar el theme entero primero:

```bash
shopify theme pull \
  --store c4f6sn-mq.myshopify.com \
  --theme 179576963265 \
  --path ./naturcalm-theme-local
```

> ⚠️ **Nunca uses `--theme 178996281537`.** Ése es `v-gomitas`, el theme **publicado**.
> El CLI, a diferencia del conector MCP, no te lo va a impedir.

### 0.6 · Copiar los archivos trabajados y subirlos

```bash
cp shopify/assets/naturcalm.css              ./naturcalm-theme-local/assets/
cp shopify/sections/nc-*.liquid              ./naturcalm-theme-local/sections/
cp shopify/templates/product.naturcalm.json  ./naturcalm-theme-local/templates/

# Validar ANTES de subir — atrapa los errores de schema sin gastar un ciclo
shopify theme check --path ./naturcalm-theme-local

shopify theme push \
  --store c4f6sn-mq.myshopify.com \
  --theme 179576963265 \
  --only "sections/nc-*.liquid" \
  --only "assets/naturcalm.css" \
  --only "templates/product.naturcalm.json" \
  --path ./naturcalm-theme-local
```

`--only` es importante: sin él, el push sincroniza todo el theme y puede **borrar** en
remoto archivos que no estén en tu carpeta local.

### 0.7 · Verificar lo subido

```bash
shopify theme pull --store c4f6sn-mq.myshopify.com --theme 179576963265 \
  --path ./verificacion
diff -r ./naturcalm-theme-local/sections ./verificacion/sections
```

O comparar tamaños contra la tabla de §5. Los archivos remotos ya coincidían byte a byte
al 2026-08-24 — si el push no cambia nada, es porque ya estaba todo bien.

### 0.8 · Abrir el preview (esto es lo que falta hacer)

```bash
shopify theme dev --store c4f6sn-mq.myshopify.com --theme 179576963265 \
  --path ./naturcalm-theme-local
```

`theme dev` levanta un preview local con hot reload — mucho mejor que push + refrescar.
También podés abrir el preview real:

`https://c4f6sn-mq.myshopify.com/products/apoyo-para-la-menopausia?preview_theme_id=179576963265`

**Recorré el checklist de §9 antes de tocar una línea de código.** La página nunca fue
vista renderizada; puede que esté perfecta o puede que haya que ajustar cosas, y no tiene
sentido adivinar.

### 0.9 · Ciclo de trabajo a partir de acá

editar en `./naturcalm-theme-local/` → `shopify theme check` → `shopify theme push --only "<archivo>"`
→ mirar en el preview → copiar el archivo de vuelta a `shopify/` del repo y commitear.

El repo pasa a ser **historial y documentación**, ya no el mecanismo de subida.

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

**Nota sobre imágenes:** las imágenes de referencia de la carpeta `APOYO MENOPAUSIA`
(`MENO 2.png`, `MENO 3.png`, `MENO 4.png`, `menopausia.png`, la captura completa
`screencapture-oshwellness...`) son fotos del producto de **OSH Wellness**, la marca
competidora usada como referencia de estructura — **no son assets propios** y no deben
subirse a la página de NaturCalm. Faltan fotos reales del producto (pendiente #9, §8).

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

| Theme | ID | Rol |
| --- | --- | --- |
| `v-gomitas` | `178996281537` | **MAIN (publicado) — no tocar** |
| **`NaturCalm — Menopausia (PDP)`** | `179576963265` | UNPUBLISHED ← **acá está todo el trabajo** |
| `Horizon` | `178609815745` | UNPUBLISHED |
| `pre-built-theme-alt-1` | `178610798785` | UNPUBLISHED |

En GraphQL el formato es `gid://shopify/OnlineStoreTheme/<ID>`; el CLI usa el ID pelado.

El theme NaturCalm es un **duplicado exacto de `v-gomitas`** más los archivos nuevos.

**Preview:** `https://c4f6sn-mq.myshopify.com/products/apoyo-para-la-menopausia?preview_theme_id=179576963265`

**Editor:** `https://admin.shopify.com/store/c4f6sn-mq/themes/179576963265/editor`

### Productos

| Producto | GID | Handle | Estado |
| --- | --- | --- | --- |
| **APOYO PARA LA MENOPAUSIA** | `gid://shopify/Product/11050777706689` | `apoyo-para-la-menopausia` | ACTIVE · **producto de trabajo** |
| Apoyo para la Menopausia | `gid://shopify/Product/11050785439937` | `naturcalm-equilibrio` | ACTIVE · **duplicado a archivar** |
| Líbrate De La Hinchazón… V-Gummies | `gid://shopify/Product/11009900544193` | `luzyna-drenaje-linfatico` | DRAFT |

Producto de trabajo, detalle (verificado 2026-08-24 vía Shopify MCP):

- Precio **39.990 ARS**, sin `compareAtPrice`.
- **Una sola variante**: `gid://shopify/ProductVariant/50523083636929` ("Default Title"), 47 unidades.
- **4 imágenes** cargadas (~1254×1254 px).
- `vendor` → `NaturCalm`, `templateSuffix` → `naturcalm`.
- `descriptionHtml`, `tags` y `productType` vacíos: la página no usa la descripción nativa.

El duplicado `naturcalm-equilibrio` tiene 0 stock, sin imágenes y un `<iframe>` en la
descripción de un intento anterior. **No fue tocado** — conviene archivarlo.

---

## 3. Cómo es el theme base

`v-gomitas` es un theme tipo *Shrine / section-pack*: ~150 secciones con prefijo `sp-*` y
un `sections/main-product.liquid` de **286 KB** con bloques muy potentes.

Bloques disponibles en `main-product` (verificados en uso): `title`, `rating_stars`,
`text`, `variant_picker`, `quantity_selector` (con `enable_quantity_discounts`),
`buy_buttons`, `shipping_checkpoints`, `sticky_atc`, `description`, `reviews`,
`collapsible_tab`.

**Decisión de arquitectura:** el buy box NO se reescribió. Se reutiliza `main-product`
configurado con estilo NaturCalm, así el carrito, el sticky ATC, las ofertas por cantidad
y los acordeones siguen siendo nativos del theme. Todo lo demás son secciones nuevas.

`templates/product.json` (30 KB, del producto V-Gummies) **no fue modificado**.

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
**Mobile-first**: la base es 1 columna; los breakpoints suben a 2 columnas en `750px` y a
la grilla final en `990px`. Cada sección expone padding separado para desktop y mobile.

---

## 5. Archivos creados

Repo: `github.com/urichsan1-star/claude-1` (público), rama
`claude/naturcalm-shopify-product-page-09ehyw`, carpeta `shopify/`.

Tamaños leídos del disco al generar este documento. Los 15 archivos coincidían byte a byte
con los del theme remoto al 2026-08-24.

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
`{{ 'naturcalm.css' | asset_url | stylesheet_tag }}`; expone colores y paddings editables.
El FAQ usa `<details>/<summary>` nativo — **cero JavaScript**.

Sobra un archivo en el theme: **`templates/product.nctest.json`** (198 bytes), usado para
diagnóstico. Es inofensivo (template alterno sin usar). Borralo desde el editor online, o
probá si el CLI lo permite con `shopify theme delete --help`.

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

**El producto con CTA reaparece 4 veces**: buy box, después de la comparación, CTA final y
sticky ATC permanente.

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

## 7. Hallazgos técnicos

**Siguen vigentes con cualquier herramienta:**

1. **Schema `range`**: el `default` debe cumplir `(default - min) % step == 0`. Un
   `step: 4` con `default: 90` rompe la subida. Todas las secciones usan `step: 2`.
   → `shopify theme check` atrapa esto antes de pushear.
2. **Shopify valida los settings del JSON template contra el schema de la sección.**
   Restricciones halladas en `main-product`: márgenes en **paso 3**; `column_gap` máx **6**;
   `padding` máx **5**. Valores conocidos que funcionan: `icon_scale 120`,
   `icon_spacing 10`, `image_width 100`, `border_radius 10`, `thumbnails_count 5`,
   paddings de sección múltiplos de 4.
3. **Liquid no permite aplicar un filtro al argumento de otro filtro.**
   `alt: image.alt | default: heading` aplica `default` a la salida de `image_tag`.
   Hay que hacer `{%- assign nc_alt = … -%}` antes.

**Pendiente confirmado:**

4. **La página nunca fue verificada visualmente.** Las sesiones cloud usadas hasta ahora
   bloquean `cdn.shopify.com`, el dominio de la tienda y `accounts.shopify.com`
   (CONNECT 403), así que no se pudo abrir el preview ni descargar las imágenes del
   producto. Es una limitación del entorno, no del proyecto — **en local se destraba**.
   Ver §9.

**Sólo aplican al conector MCP (por si se vuelve a un entorno restringido):**

5. `themeFilesUpsert` con `body.type: URL` **falla en silencio**: si el archivo no valida,
   devuelve `upsertedThemeFiles: []` y `userErrors: []`, sin error. Con `body.type: TEXT`
   sí reporta. El CLI reporta los errores en terminal, así que este problema desaparece.
6. Las escrituras al theme MAIN estaban **bloqueadas** por la política del MCP, y
   `themeFilesDelete` estaba bloqueado por completo. **El CLI no tiene esas barreras** —
   sólo respeta los permisos del token. De ahí la advertencia de §0.5.
7. `raw.githubusercontent.com` era alcanzable desde el servidor de Shopify, lo que permitía
   subir por URL desde el repo público. Ya no hace falta con el CLI local.

---

## 8. Pendientes antes de publicar

**Placeholders a completar** (marcados en la página con `[corchetes]` rosas o ⚠︎):

1. **Cifras** — los 4 números están en `[00%]`. Completar con datos propios verificables o
   eliminar la sección.
2. **Reseñas** — 3 bloques vacíos + puntaje `[0,0] de 5` y `[N] reseñas`. Cargar reales o
   conectar Judge.me / Loox / Shopify Reviews.
3. **Especialistas** — 2 perfiles de ejemplo. Requieren autorización escrita.
4. **Dosis por porción** de los 6 botánicos + composición completa (ficha técnica).
5. **Envíos, cambios y devoluciones** — aparece en 4 lugares.
6. **Email de contacto** (hoy `hola@naturcalm.com`, placeholder) en el FAQ.
7. **Registro sanitario** y leyendas obligatorias en Descargos.
8. **Cantidad de cápsulas por toma** y días de tratamiento por frasco.
9. **Imágenes**: prensa, foto de cada botánico, imagen de problema, de marca, de mecanismo,
   de FAQ, pasos del ritual, avatares. Todas caen en un placeholder rayado si están vacías.
   **Las fotos de OSH Wellness de la carpeta de referencia NO sirven** — son de otra marca.
10. **Links de los botones** (`button_link`) — vacíos; conviene apuntarlos al ancla del buy
    box o a `/cart/add`.

**Decisión comercial pendiente:** las ofertas 2× y 3× están **sin descuento real**. Si se
quiere mostrar ahorro, hay que crear descuentos por cantidad en Shopify; poner un "% off"
sólo en el theme mostraría un precio que el checkout no aplica.

**Limpieza:** archivar `naturcalm-equilibrio` y borrar `templates/product.nctest.json`.

**Nota sobre el template:** `templateSuffix` es propiedad del producto, no del theme.
Mientras `v-gomitas` siga publicado, esa página cae al template de producto por defecto
(Shopify hace fallback si el template no existe). El diseño nuevo se ve en el preview y
pasa a producción al publicar el theme NaturCalm.

---

## 9. Checklist de verificación visual

**Este es el trabajo pendiente número uno.** Recorrelo antes de tocar código: la página
nunca se vio renderizada, así que no sabemos si hay bugs visuales o si está bien.

### Mobile primero (375 px — era la prioridad del brief)

- [ ] Ninguna sección desborda horizontalmente. Scrolleá lateral: no debe moverse nada.
- [ ] Aparecen las **14 secciones** en el orden de §6, ninguna vacía ni duplicada.
- [ ] **Sticky ATC** aparece al scrollear, a ancho completo, y **no tapa el CTA final**
      ni el último bloque de la página.
- [ ] El selector de 3 tramos se ve completo, con **"2 frascos" preseleccionado** y los
      badges "EL MÁS ELEGIDO" / "MEJOR VALOR" legibles.
- [ ] Los 4 acordeones del buy box abren y cierran.
- [ ] Tamaños de texto legibles sin zoom; los títulos serif no se cortan.
- [ ] Las tarjetas de ingredientes se apilan en 1 columna, sin imágenes deformadas.
- [ ] La tabla comparativa se lee sin scroll horizontal (columnas de 84 px en mobile).

### Desktop (≥1200 px)

- [ ] Ingredientes en 3 columnas, reseñas en 3, especialistas en 2.
- [ ] Los bloques split (Problema, Propósito, Cómo funciona) alternan imagen/texto.
- [ ] El contenido no supera los 1180 px ni queda pegado a los bordes.

### Transversal

- [ ] **Cormorant Garamond carga de verdad.** Si el `@import` de Google Fonts falla, los
      títulos caen a Georgia y se pierde el aire premium. Miralo en DevTools → Network.
- [ ] La **banda oliva oscura** (`#46512F`) tiene contraste suficiente en su texto.
- [ ] Los **placeholders rayados** aparecen donde falta imagen y los `[corchetes]` rosas
      donde falta dato — sirven de checklist visual de §8.
- [ ] El **FAQ abre y cierra sin JavaScript** (desactivá JS y probá).
- [ ] **Agregar al carrito funciona** con los 3 tramos y el precio del carrito es
      precio × cantidad (recordá: hoy no hay descuento real).
- [ ] No hay errores de Liquid renderizados como texto crudo en ninguna sección.

Anotá lo que falle y arreglalo con el ciclo de §0.9.

---

## 10. Referencia rápida de comandos

```bash
# Validar (siempre antes de subir)
shopify theme check --path ./naturcalm-theme-local

# Subir un archivo puntual
shopify theme push --store c4f6sn-mq.myshopify.com --theme 179576963265 \
  --only "sections/nc-faq.liquid" --path ./naturcalm-theme-local

# Preview con hot reload
shopify theme dev --store c4f6sn-mq.myshopify.com --theme 179576963265 \
  --path ./naturcalm-theme-local

# Bajar el estado remoto a otra carpeta para comparar
shopify theme pull --store c4f6sn-mq.myshopify.com --theme 179576963265 \
  --path ./verificacion
diff -r ./naturcalm-theme-local/sections ./verificacion/sections
```

Si tenés el conector de Shopify disponible, también podés verificar por GraphQL
(solo lectura):

```graphql
query {
  theme(id: "gid://shopify/OnlineStoreTheme/179576963265") {
    files(filenames: ["sections/nc-*"], first: 20) {
      nodes { filename size }
    }
  }
}
```

Cuando un cambio esté validado y confirmado en el preview, copialo de vuelta a `shopify/`
del repo y commiteá en `claude/naturcalm-shopify-product-page-09ehyw`. El repo es
historial, ya no el mecanismo de subida.
