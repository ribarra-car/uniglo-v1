# Decisiones de implementación

El brief completo del usuario es la especificación principal. Se consultó la skill “Director de Sitios” proporcionada en la conversación, especialmente sus criterios de jerarquía visual, espacio, acento de color, foco, movimiento reducido y revisión móvil.

Se aplicó la autorización expresa de construir de inmediato, sin puertas de aprobación adicionales. Se priorizó el brief frente al stack fijo y la estructura comercial de esa skill:

- HTML, CSS y JavaScript sin dependencias de producción: GitHub Pages, sin cuentas, backend o analítica.
- Catálogo interactivo como centro de la experiencia, hero corto y un bloque de venta. No se agregaron testimonios, cifras de mercado ni afirmaciones de validación.
- Revisión visual 1.0.1 solicitada por el usuario: fondo cálido `#fffdf7`, tinta `#23212b`, morado `#4b35d7`, verde lima `#dafa67`, coral `#ff876f` y lavanda `#d9cafa`. Helvetica Neue o Arial, con titulares de mayor peso y sin descarga de fuentes.
- El logo es únicamente el texto UNIGLO en encabezado, pie y favicon. El símbolo anterior se eliminó.
- Collage con fotografías ya incluidas en el proyecto, recortes curvos, círculos, trazo libre y un sticker geométrico. El pedido posterior de más colores y formas actualiza la dirección neutra del brief original.
- Fotografías locales de referencia para las prendas ficticias, autorizadas por el alcance de demostración del brief. No son evidencia de inventario, estado real o vendedores. Fuentes en `CREDITOS.md`.
- Animaciones breves de entrada y hover; se desactivan con `prefers-reduced-motion`. No hay animaciones que bloqueen la lectura ni librerías de scroll.
- Datos de producto separados de la lógica; precios en centavos enteros y comisión redondeada al centavo.
- Solo se guardan campos cerrados, códigos aleatorios e interacciones. El texto libre se usa en pantalla y se omite del almacenamiento y la exportación.
- Sesión nueva limpia el estado de interacción y conserva los resultados anteriores por separado. Las exportaciones son por sesión para evitar una mezcla accidental de participantes.

La entrega es un proyecto local preparado para publicación por el equipo en GitHub Pages. No se creó un repositorio ni se publicó en una cuenta externa. El uso de servicios de hosting no es necesario para abrir los archivos o ejecutar las pruebas locales.
