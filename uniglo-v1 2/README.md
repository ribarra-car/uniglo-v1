# UNIGLO — MVP web V1

Edición visual 1.0.1: morado, verde lima y coral; collage de fotografías, recortes curvos y marca tipográfica **UNIGLO** sin símbolo.

Prototipo estático para validar un marketplace P2P de ropa de segunda mano con jóvenes de 18 a 30 años que viven, estudian o trabajan en CDMX y Estado de México. Desarrollado conforme al brief completo incluido en `docs/BRIEF-ORIGINAL.md`.

## Abrir y usar

1. Descomprime el proyecto y abre `index.html` en un navegador moderno.
2. Explora el catálogo, selecciona una prenda o prueba **Quiero vender**.
3. Para registrar una prueba, abre **Investigador** en la barra inferior o **Modo investigador** en el pie de página.

No necesita instalación, compilación, cuentas ni claves. Para pruebas formales utiliza la dirección publicada de GitHub Pages o una dirección local estable: el almacenamiento de archivos abiertos con `file://` varía entre navegadores.

Si tienes Python, puedes servir la carpeta desde una terminal situada dentro del proyecto:

```sh
python3 -m http.server 8000
```

En Windows puede ser `py -m http.server 8000`. Abre `http://localhost:8000`. Este servidor solo sirve archivos para la vista previa; el sitio publicado no utiliza Python ni backend. Usa siempre el mismo dominio, puerto y perfil del navegador durante una serie de pruebas.

## Qué funciona

- 12 prendas ficticias, con fotografías locales de referencia, precio MXN, talla y estado.
- Búsqueda por nombre o marca, sin distinguir acentos o mayúsculas.
- Filtros combinables por categoría, talla y precio; resultados vacíos y limpieza de filtros.
- Detalle accesible con descripción, marca, medidas, estado y defectos ficticios.
- Interés declarado, confirmación hipotética de contacto, rechazo, cancelación y seis motivos de confianza opcionales.
- Publicación simulada con cinco datos básicos y vista previa. El anuncio no se agrega al catálogo.
- Comisión hipotética de 10%, aceptación Sí / No / Depende, independiente de completar la publicación.
- Sesiones anónimas, resumen por participante, historial local y descargas CSV y JSON.
- Finalización de sesión, nueva sesión separada y borrado local con confirmación.

No hay inventario, pagos, entregas, chat, mensajes reales, autenticación, base externa ni analítica externa. Las hipótesis se mantienen exploratorias; las interacciones nunca se presentan como ventas.

## Publicar gratis en GitHub Pages

1. En GitHub crea un repositorio **público**, por ejemplo `uniglo-v1`. En GitHub Free, Pages funciona con repositorios públicos.
2. Sube **el contenido** de esta carpeta a la raíz del repositorio: `index.html`, `styles.css`, `catalogo.js`, `core.js`, `app.js`, `assets/` y el resto de los archivos. Conserva la carpeta `assets` y los nombres exactos. No subas el ZIP como único archivo ni agregues una carpeta envolvente que deje `index.html` fuera de la raíz.
3. Incluye `.nojekyll`, un archivo vacío que evita procesamiento con Jekyll. El sitio también usa rutas relativas para funcionar bajo el nombre del repositorio.
4. Abre **Settings → Pages → Build and deployment**. En **Source** elige **Deploy from a branch**.
5. Elige la rama **main** y la carpeta **/(root)**; pulsa **Save**.
6. Cuando termine la publicación, en Pages pulsa **Visit site**. La dirección suele tener la forma `https://TU-USUARIO.github.io/uniglo-v1/`.
7. Revisa la página en celular. Abre Investigador, crea una sesión de ensayo, descarga un resultado y bórrala antes de recibir participantes.

No se requiere un flujo personalizado de Actions ni comandos de construcción. No subas los resultados exportados al repositorio del sitio.

Referencia oficial consultada para estas instrucciones: [Crear un sitio de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Modo investigador

1. Abre **Investigador → Iniciar participante nuevo**.
2. El ID se genera automáticamente. Selecciona segmento y rol. Si alguien estudia y trabaja, pídele elegir el segmento con el que se identifica para esta prueba y aplica el mismo criterio al resto del estudio.
3. Explica que se registrarán acciones anónimas en ese navegador y marca la casilla cuando la persona lo sepa.
4. Pulsa **Comenzar sesión de prueba**. Una barra verde confirma el ID que se está registrando. El rol organiza el análisis; no restringe los flujos que puede explorar.
5. Deja que explore. Abre Investigador y pulsa **Finalizar sesión** al terminar.
6. Revisa el resumen y descarga **JSON**, **CSV** o ambos. También puedes exportar en curso; se identifica como una sesión parcial.
7. Usa **Iniciar participante nuevo** para la siguiente persona. Se limpian filtros, búsquedas y formularios; las sesiones anteriores permanecen separadas en el selector y se pueden exportar individualmente.

Sin sesión activa se puede usar todo el prototipo, pero las acciones no se registran. Abrir el panel o exportar no genera eventos de comportamiento. Recargar la página retoma la sesión activa; no cambia de participante. Usa una sola pestaña durante cada prueba. Si se cambia de participante en otra pestaña, esta detiene el registro y limpia la interacción para evitar mezclar personas.

**Almacenamiento:** clave `uniglo.research.v1` en `localStorage`. Pertenece a ese perfil del navegador y al origen del sitio. Otro navegador, equipo o dominio tiene sus propios datos. No existe seguimiento automático entre personas ni dispositivos. El modo investigador no tiene contraseña; cualquier persona con acceso a ese perfil puede ver las sesiones. Exporta y borra al finalizar una jornada, especialmente en equipos compartidos.

Si el almacenamiento está bloqueado, es incompatible o se llena, aparece un aviso y se conserva temporalmente el registro en memoria de esa pestaña. En ese caso exporta antes de cerrar o recargar. Borrar datos del navegador puede eliminar todas las sesiones. **Borrar todos los datos de prueba** borra solo la clave de UNIGLO; no borra las descargas existentes.

## Qué se mide y qué significa

| Evidencia | Registro | Interpretación |
|---|---|---|
| Exploración | `product_viewed`, `section_viewed` | Consultas de detalle y navegación mediante enlaces |
| Búsqueda | `search_performed` | Longitud de consulta, borrado y IDs encontrados; el texto no se guarda |
| Filtros | `filter_changed`, `filters_cleared` | Categoría, talla o precio y resultados encontrados |
| Interés declarado | `interest_clicked` | Clic en “Me interesa esta prenda” |
| Disposición a contactar | `contact_confirmed` | Respuesta “Sí, solicitaría contacto” |
| Rechazo o cancelación | `contact_declined`, `interest_cancelled` | “Todavía no” o cerrar/volver sin confirmar |
| Confianza | `trust_reasons` | Razones seleccionadas al confirmar una respuesta |
| Interés de venta | `publication_started`, `publication_completed`, `publication_abandoned` | Inicio, vista previa completada y cierre sin completar |
| Precio propuesto | Datos de `publication_completed` | Precio ficticio, categoría, talla y estado; nunca el texto libre |
| Disposición a comisión | `commission_answered` | Sí, No o Depende, vinculados a una publicación |
| Límites de sesión | `session_started`, `session_ended` | Inicio y fin explícitos o cambio de participante |

Las búsquedas se registran tras 650 ms sin cambios, al presionar Enter o al salir del campo; repetir el mismo texto sin cambiarlo no agrega otro evento. Los filtros se aplican inmediatamente. Cerrar una publicación ya completada sin contestar la comisión cuenta como **comisión sin respuesta**, no como rechazo. Cerrar una sesión no convierte las intenciones en transacciones.

Los conteos son de **acciones**, que una persona puede repetir. El resumen distingue prendas únicas consultadas. Para comparar segmentos, agrupa varias sesiones; no interpretes 10 clics de una persona como 10 personas interesadas.

## Exportaciones

**JSON:** metadatos, versión de aplicación, instantánea del catálogo al comenzar, sesión con eventos y resumen calculado. Es la opción recomendada para conservar el contexto completo.

**CSV:** una fila por evento, con ID de participante, segmento, rol, inicio/fin, fecha UTC, acción, producto, publicación, importes, respuesta de comisión, motivos y `details_json`. Incluye BOM UTF-8 para acentos y comillas para campos con comas. Si Excel no separa las columnas, importa el archivo como UTF-8 con delimitador **coma**. Las celdas que podrían interpretarse como fórmulas se neutralizan.

Los importes `*_cents_mxn` están en **centavos enteros**: `35000` equivale a $350 MXN. La comisión se redondea al centavo más cercano y el neto se calcula restando esa comisión: precio = comisión + neto. Los horarios exportados son ISO 8601 UTC; la interfaz muestra la hora local del dispositivo.

No se guardan ni exportan el nombre libre de la prenda o el texto de búsqueda. No se piden nombres de personas, correos, teléfonos, direcciones, edades exactas ni datos institucionales. No escribas datos personales en los campos libres.

## Editar las prendas

Edita `catalogo.js` con cualquier editor de texto. Cada objeto tiene:

```js
{
  id: 'U13',                     // único y estable
  name: 'Camisa de ejemplo',
  category: 'Playeras y camisas',
  priceCents: 22000,             // $220 MXN, NO 220
  size: 'M',
  condition: 'Muy buen estado',
  brand: 'Sin marca',
  image: 'assets/mi-foto.jpg',
  alt: 'Camisa azul, fotografía de referencia',
  description: 'Descripción de la prenda.',
  measurements: 'Pecho: 54 cm · Largo: 72 cm',
  defects: 'Desgaste en los puños.'
}
```

Las categorías del filtro se generan del catálogo. Si agregas una talla distinta, agrégala también a `sizeFilter` en `index.html`. Los tipos de prenda y tallas del simulador se editan en el mismo HTML. Mantén IDs estables durante una ronda de pruebas. Si cambias precios, fotos o descripciones, comienza una sesión nueva y documenta la versión para no comparar estímulos distintos como si fueran iguales.

Reemplaza fotografías en `assets/` y actualiza su ruta y texto alternativo. Conserva los avisos de catálogo ficticio mientras sean ejemplos. Para un catálogo real se necesita una revisión específica de información, permisos de fotografías y alcance: cambiar los datos no agrega contacto, ventas ni servicios reales.

## Archivos

```text
index.html         estructura, formularios y diálogos
styles.css         diseño responsive y accesibilidad visual
catalogo.js        12 prendas de demostración editables
core.js            filtros, importes, resumen y exportación
app.js             interacciones y sesiones locales
assets/            fotografías locales y favicon
.nojekyll          publicación estática en Pages
docs/              brief original, protocolo y revisión
tests/core.test.cjs pruebas de reglas de datos con Node.js
```

Fotografías de referencia alojadas localmente, sin solicitudes a Unsplash al usar la página. Consulta `CREDITOS.md` para fuentes. Se usa Helvetica Neue o Arial según el dispositivo, sin descargar fuentes. Peso total aproximado del proyecto: 1.4 MB.

Pruebas reproducibles de reglas de datos (Node.js 18 o posterior; no es necesario para usar el sitio):

```sh
node --test tests/core.test.cjs
```

Consulta `docs/VERIFICACION.md` para las comprobaciones realizadas y `docs/PROTOCOLO.md` para una prueba de mercado breve. Los resultados de revisión son ensayos con datos ficticios, no evidencia de mercado.
