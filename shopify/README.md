# NaturCalm — Página de producto (Shopify)

Implementación de la PDP de **NaturCalm · Apoyo para la Menopausia**, construida
tomando como blueprint la arquitectura de conversión de la referencia
(oshwellness.com/es/products/menopause-support) y reconstruida por completo con
identidad, copy y sistema visual propios.

## Contenido

| Archivo | Función |
| --- | --- |
| `assets/naturcalm.css` | Design system: tokens de color, tipografía, grillas y todos los componentes. Mobile-first. |
| `sections/nc-press-bar.liquid` | Barra de prensa / aval institucional. |
| `sections/nc-problem.liquid` | Problema y calificación del público (checklist + imagen). |
| `sections/nc-stats.liquid` | Banda de cifras / respaldo racional. |
| `sections/nc-ingredients.liquid` | Grilla de botánicos con tags y dosis. |
| `sections/nc-purpose.liquid` | Propósito de marca (split imagen + cita). |
| `sections/nc-mechanism.liquid` | Cómo funciona la fórmula (banda oliva oscura). |
| `sections/nc-experts.liquid` | Aval de especialistas. |
| `sections/nc-comparison.liquid` | Tabla comparativa + CTA. |
| `sections/nc-ritual.liquid` | Cómo usarlo, en 3 pasos. |
| `sections/nc-faq.liquid` | FAQ con `<details>` nativo (sin JS). |
| `sections/nc-cta-band.liquid` | CTA de cierre con garantías. |
| `sections/nc-reviews.liquid` | Muro de reseñas. |
| `sections/nc-disclaimer.liquid` | Descargos legales y referencias. |
| `templates/product.naturcalm.json` | Template que ensambla el buy box nativo del theme + las 13 secciones. |

## Notas

- Ninguna sección pisa archivos del theme: todos los nombres van con prefijo `nc-`.
- El buy box reutiliza la sección `main-product` del theme (carrito, sticky ATC,
  ofertas por cantidad y acordeones nativos), así que no se rompe nada existente.
- Todo dato no verificable (cifras, reseñas, especialistas, dosis, envíos) quedó
  como **placeholder marcado** para reemplazar antes de publicar.
