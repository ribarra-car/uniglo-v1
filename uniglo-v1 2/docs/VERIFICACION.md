# Verificación — UNIGLO V1

## Revisión visual 1.0.1

Se actualizó la identidad a petición del usuario: morado intenso, verde lima, coral y lavanda; collage de fotografías, recortes curvos, círculos y sticker geométrico. Se eliminó el símbolo de la marca: encabezado, pie y favicon muestran únicamente UNIGLO.

Se volvió a comprobar el diseño a 320, 390, 768, 1280 y 1920 px: sin desbordamiento horizontal y con cero fotografías rotas en el reporte de revisión. Se revisaron visualmente portada, catálogo móvil y detalle de producto. La búsqueda con filtros combinados encontró U02; el flujo de interés mostró su confirmación y la publicación de $350 mantuvo $35 de comisión y $315 netos.

Contraste de las combinaciones principales, calculado con luminancia relativa: blanco sobre morado 7.53:1; tinta sobre lima 13.48:1; tinta sobre coral 6.76:1; tinta sobre lavanda 10.41:1; texto secundario sobre fondo cálido 5.92:1. Se conservaron el foco visible y la preferencia de movimiento reducido.

La lógica de registro y exportación se conserva; la versión de la aplicación cambia a 1.0.1 para identificar esta edición. Las comprobaciones funcionales completas de la primera entrega se describen a continuación.

Revisión realizada el 28 de octubre de 2026 con datos ficticios de ensayo. No representa pruebas con clientes ni validación de las hipótesis.

## Flujos comprobados en navegador

| Comprobación | Resultado observado |
|---|---|
| Inicio y navegación | Enlaces a catálogo, venta y explicación llevan a sus secciones |
| Catálogo | 12 prendas, imágenes locales, precio MXN, talla, estado y aviso de demostración |
| Búsqueda | “jeans” encuentra U02 y registra una búsqueda sin guardar el texto |
| Filtros combinados | Jeans + talla 30 + rango $200.01–$400 mantiene U02 |
| Categoría y talla | Chamarras muestra 2 prendas; Chamarras + XS muestra 0 |
| Estado vacío | Mensaje y botón de restablecer recuperan las 12 prendas |
| Detalle | Abre fotografía, descripción, marca, medidas, estado y defectos |
| Contacto afirmativo | Guarda “Solicitaría contacto” y razones seleccionadas; no envía mensajes |
| Contacto negativo | Guarda “Todavía no” y un motivo opcional |
| Cancelación | Escape cierra el interés pendiente y aumenta el conteo de cancelaciones |
| Publicación | Formulario completo genera vista previa y registra el precio |
| Abandono | Cerrar el formulario antes de la vista previa registra publicación abandonada |
| Validación del precio | Un precio negativo impide completar el formulario |
| Comisión de $350 | $35 de comisión, $315 netos |
| Comisión con centavos | $350.55 → $35.06 de comisión y $315.49 netos |
| Comisión Sí / No / Depende | Cada respuesta se registra; la publicación permanece completada |
| Comisión omitida | Completar y salir sin contestar muestra “Sin respuesta: 1” |
| Sesión anónima | ID automático, segmento, rol y aviso antes de comenzar |
| Resumen | Conteos de detalle, búsquedas, filtros, interés, contacto, publicación, comisión y motivos |
| Finalizar | Detiene el registro y conserva la sesión seleccionable |
| Participante nuevo | Nuevo ID y métricas de comportamiento en cero; sesión anterior separada |
| Recargar | Recupera la sesión activa y sus acciones |
| Dos pestañas | Cambiar participante en una detiene el registro en la anterior; el nuevo comienza en cero |
| CSV y JSON | Ambos se descargaron y su contenido se abrió y verificó |
| Consistencia de exportaciones | CSV y JSON coincidieron en 14 eventos del primer ensayo |
| Privacidad de exportaciones | No incluyeron texto de búsqueda ni el nombre libre del anuncio |
| Borrado | Cancelar conservó las sesiones; confirmar dejó 0 sesiones y resumen vacío |
| Almacenamiento bloqueado | Un contexto sin acceso a almacenamiento local mostró el aviso de registro temporal |

## Pantallas y accesibilidad

Se revisó el diseño con ventanas internas de **320, 390, 768, 1280 y 1920 px**. La anchura del documento coincidió con la ventana en esos cinco casos, sin desbordamiento horizontal; el reporte no detectó imágenes rotas. Se inspeccionaron visualmente el inicio, filtros y tarjetas a 390 px, y los diálogos de detalle y venta a ese tamaño.

La aplicación incluye enlace para saltar al catálogo, etiquetas en campos, grupos de preguntas, texto alternativo en fotografías, foco visible, avisos de estado y diálogos nativos que administran el foco y se cierran con Escape. Se comprobó el cierre con Escape y el traslado del foco durante el flujo de interés. La hoja de estilos respeta `prefers-reduced-motion`. No se afirma una auditoría WCAG completa ni una puntuación Lighthouse; no se ejecutaron esas auditorías.

## Reglas de datos

Las **7 pruebas de `tests/core.test.cjs` pasaron**:

1. Catálogo con 12 IDs únicos, campos e imágenes existentes.
2. Búsqueda normalizada y filtros combinados.
3. Límites de rangos de precio sin solapamientos ni huecos.
4. Precios válidos y rechazo de negativos, vacío, precisión excesiva y valores fuera de rango.
5. Comisión del ejemplo, redondeo y conservación de la suma precio = comisión + neto.
6. Resumen distingue consultas repetidas, prendas únicas, contacto, rechazo, cancelación y comisión sin responder.
7. CSV con escape correcto, acentos, importes, neutralización de fórmulas y contexto JSON.

También se comprobó la sintaxis de los archivos JavaScript y la correspondencia de recursos locales. El código de producción no contiene llamadas de red, fuentes remotas, SDK de analítica ni conectores externos.

## Alcance de esta revisión

La revisión de interacción se hizo en el navegador integrado del entorno de desarrollo. La publicación en una cuenta GitHub y la comprobación en dispositivos físicos quedan para cuando el equipo publique la carpeta. Conviene probar la descarga y el almacenamiento en el navegador específico de cada jornada, especialmente con navegación privada o restricciones de descargas.

Los registros de ensayo se borraron del navegador al terminar; el proyecto no distribuye sesiones precargadas ni resultados de mercado inventados.
