<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Alta de una crónica nueva

1. Crear `src/content/cronicas/<slug>.mdx` y registrar en `registro.ts` (`cronicasBase` + `cargadores`).
2. Completar taxonomía en `src/content/cronicas/taxonomia.ts` (`epoca`, `categorias`, `anioInicio`, `anioFin`).
3. Opcional: `destacada`, `numero`, `orden`; agregar a un recorrido en `recorridos.ts`.
4. Validar: `npm run cronicas:validar` (slugs, protagonista, categorías, cargador MDX).
5. No depender del orden del array en `registro.ts`; el catálogo ordena por `indice.ts`.

Navegación a escala: catálogo agrupado en `/cronicas`, hubs en `/periodos` y `/categorias`, índices en `src/lib/cronicas/indice.ts`.
