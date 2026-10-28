# UNIGLO — Desarrollo de MVP Web V1

## 1. Objetivo del proyecto

Quiero que desarrolles un MVP web funcional para UNIGLO, un proyecto universitario de emprendimiento de la Universidad Anáhuac México.

Utiliza tus herramientas y skills especializadas en desarrollo web para construir una página completa, funcional, responsive y preparada para publicarse gratuitamente en GitHub Pages.

La prioridad no es construir una aplicación comercial definitiva, sino una plataforma sencilla que podamos mostrar a clientes potenciales y utilizar para validar nuestro modelo de negocio.

El MVP debe funcionar correctamente, permitir interacciones reales dentro de una simulación y registrar información útil para analizar las pruebas.

## 2. ¿Qué es UNIGLO?

UNIGLO es un marketplace digital P2P (persona a persona) para comprar y vender ropa de segunda mano.

Conecta a personas que desean vender prendas que ya no utilizan con otras interesadas en adquirirlas a precios accesibles.

UNIGLO no compra inventario, no almacena ropa y no realiza entregas. Su función es facilitar que compradores y vendedores se encuentren, consulten información sobre las prendas y puedan coordinar una posible transacción.

### Nuevo mercado objetivo

Nuestro mercado inicial será:

**Jóvenes de 18 a 30 años que viven, estudian o trabajan en CDMX y el Estado de México.**

Incluye principalmente:

- Estudiantes universitarios.
- Jóvenes trabajadores.
- Personas interesadas en moda de segunda mano.
- Jóvenes que desean ahorrar al comprar ropa.
- Personas interesadas en vender prendas que ya no utilizan.

El acceso NO debe limitarse a estudiantes universitarios ni requerir correos institucionales.

La universidad será uno de nuestros primeros espacios de validación, pero no el único mercado de UNIGLO.

### Problemas identificados

A partir de nuestras entrevistas y análisis, identificamos preocupaciones relacionadas con:

- Desconfianza sobre el estado real de las prendas.
- Dudas acerca de las tallas, medidas y calidad.
- Falta de información suficiente antes de comprar.
- Dificultad para encontrar ropa de segunda mano que resulte atractiva.
- Incertidumbre sobre la confiabilidad de otros vendedores.
- Esfuerzo necesario para buscar prendas y coordinar una compra.

Queremos comprobar si UNIGLO puede reducir algunas de estas dificultades.

## 3. Hipótesis que queremos validar

### Hipótesis principal

Los jóvenes de 18 a 30 años en CDMX y Estado de México estarían dispuestos a utilizar una plataforma digital para explorar ropa de segunda mano y avanzar hacia una posible compra cuando encuentran prendas atractivas, información clara y condiciones que les generan confianza.

### Hipótesis secundarias

**H1. Interés de compradores:** Los usuarios explorarán el catálogo y encontrarán prendas de su interés.

**H2. Confianza:** La información sobre tallas, estado y características ayudará a los usuarios a considerar una compra.

**H3. Interés de vendedores:** Algunas personas estarán dispuestas a publicar prendas para venderlas mediante UNIGLO.

**H4. Modelo de ingresos:** Los posibles vendedores podrían aceptar una comisión por venta si perciben que UNIGLO les ayuda a encontrar compradores.

**H5. Segmentación:** El comportamiento y las necesidades podrían variar entre estudiantes universitarios y jóvenes trabajadores.

Estas hipótesis no deben presentarse como validadas antes de realizar las pruebas.

## 4. Estructura de la página web

Crear una página web con las siguientes funcionalidades.

### A. Inicio

Diseñar una portada breve y atractiva con:

- Nombre UNIGLO.
- Eslogan: "Dale una segunda vida a tu ropa".
- Descripción: "Compra y vende ropa de segunda mano cerca de ti".
- Referencia a CDMX y zona metropolitana.
- Botón "Explorar prendas".
- Botón "Quiero vender".

No utilizar expresiones que limiten el servicio únicamente a estudiantes universitarios.

No crear una landing page demasiado extensa.

### B. Catálogo interactivo

Mostrar aproximadamente 10 a 12 prendas de demostración, con variedad suficiente para observar las preferencias de los usuarios.

Incluir algunas categorías como:

- Playeras y camisas.
- Sudaderas y suéteres.
- Jeans y pantalones.
- Chamarras.
- Vestidos u otras prendas.

Cada tarjeta debe mostrar:

- Fotografía.
- Nombre de la prenda.
- Precio en MXN.
- Talla.
- Estado de conservación.

Agregar búsqueda por nombre y filtros sencillos por categoría, talla y precio.

El catálogo debe permitir explorar productos sin registrarse.

Los productos de demostración deben estar identificados como tales. No inventar vendedores reales ni afirmar que las prendas están disponibles para compra.

Estructurar los datos de manera que posteriormente podamos sustituir fácilmente los ejemplos por prendas reales.

### C. Detalle de producto

Al seleccionar una prenda, abrir una vista detallada con:

- Fotografía principal.
- Nombre y descripción.
- Precio.
- Marca, cuando corresponda.
- Talla y medidas disponibles.
- Estado de conservación.
- Posibles defectos.
- Información general sobre cómo funcionaría el contacto con el vendedor.

Agregar un botón destacado:

"Me interesa esta prenda".

### D. Simulación de interés de compra

Esta funcionalidad es fundamental para el MVP.

Cuando un usuario seleccione "Me interesa", abrir una ventana donde pueda confirmar si realmente le gustaría avanzar hacia el contacto con un vendedor.

Incluir dos opciones:

- "Sí, solicitaría contacto".
- "Todavía no".

Registrar la interacción correspondiente.

No solicitar pagos, teléfonos, correos ni datos personales.

Explicar que se trata de una simulación de interés y no de una compra real.

También permitir registrar qué información adicional necesitaría el usuario para sentirse cómodo avanzando hacia la compra, utilizando opciones sencillas como:

- Más fotografías.
- Medidas exactas.
- Información sobre el estado.
- Mayor confianza en el vendedor.
- Posibilidad de revisar la prenda.
- Otra razón.

Evitar cuestionarios largos durante la navegación.

### E. Quiero vender

Crear una sección donde el usuario pueda simular la publicación de una prenda.

Solicitar únicamente:

- Tipo de prenda.
- Nombre o descripción breve.
- Talla.
- Estado de conservación.
- Precio de venta propuesto.

Mostrar una vista previa del anuncio al finalizar.

Registrar si el usuario comienza el proceso y si lo completa.

No necesitamos crear perfiles ni almacenar publicaciones en un servidor.

### F. Validación del modelo de ingresos

Queremos explorar si una comisión por venta sería aceptable para los vendedores.

Utilizar como hipótesis inicial una comisión del 10% sobre el precio de venta.

Al finalizar la simulación de publicación, mostrar de manera clara:

- Precio de venta propuesto.
- Comisión hipotética de UNIGLO: 10%.
- Cantidad que recibiría el vendedor si se concretara la venta, sin considerar otros cargos.

Por ejemplo, para una prenda de $350:

Precio: $350

Comisión UNIGLO: $35

Monto para el vendedor: $315

Después preguntar:

"Si UNIGLO te ayudara a encontrar un comprador, ¿aceptarías esta comisión?"

Opciones:

- Sí.
- No.
- Depende del servicio que ofrezca.

Registrar la respuesta.

Esta es una validación exploratoria de disposición a pagar, no un cobro ni una validación definitiva de rentabilidad.

La prueba de interés por vender no debe depender obligatoriamente de aceptar la comisión.

## 5. Modo investigador: medición del MVP

Este apartado es especialmente importante.

Necesitamos un sistema sencillo para registrar el comportamiento de cada persona que pruebe la página.

Debe funcionar directamente en el navegador, sin servicios externos.

### Inicio de una sesión de prueba

Crear un "Modo investigador" discreto.

Antes de comenzar, permitir registrar:

- Identificador anónimo del participante.
- Segmento: estudiante universitario, joven trabajador u otro joven del mercado objetivo.
- Rol que desea explorar: comprador, vendedor o ambos.

No recopilar nombres completos, teléfonos ni información personal innecesaria.

### Acciones que debemos registrar

- Productos consultados.
- Uso de filtros.
- Búsquedas realizadas.
- Prendas que generaron interés.
- Clics en "Me interesa".
- Confirmaciones de intención de contacto.
- Cancelaciones.
- Inicio de una publicación.
- Publicaciones simuladas completadas.
- Precios propuestos por vendedores.
- Respuestas sobre la comisión hipotética.
- Motivos de desconfianza seleccionados.

### Resultado de la sesión

Al finalizar, mostrar un resumen con los principales resultados.

Permitir exportar los datos de la sesión como archivo CSV o JSON.

Incluir una opción para iniciar una nueva sesión sin mezclar los resultados de distintos participantes.

Si se utiliza almacenamiento local, aclarar que la información pertenece al navegador donde se hizo la prueba y que debe exportarse antes de borrar los datos.

No afirmar que existe seguimiento automático entre distintos usuarios o dispositivos.

No conectar servicios de analítica externos.

## 6. Diseño

Quiero un diseño moderno, limpio y juvenil, inspirado en plataformas contemporáneas de moda.

Características:

- Diseño minimalista.
- Tipografía con personalidad y buena legibilidad.
- Fotografías como elemento visual principal.
- Fondo claro y colores neutros.
- Un color de acento discreto.
- Tarjetas de producto sencillas.
- Bordes ligeramente redondeados.
- Animaciones suaves.
- Buena organización de los espacios.
- Navegación intuitiva.
- Adaptación completa a celular.

Evitar:

- Exceso de degradados.
- Elementos decorativos sin función.
- Pantallas innecesarias.
- Párrafos largos.
- Aspecto de plantilla genérica.
- Funcionalidades falsas que aparenten ser reales.

La página debe sentirse como el prototipo de un marketplace, no como una presentación escolar.

Todo el contenido debe estar en español natural de México.

## 7. Requisitos técnicos

- Sitio web estático.
- HTML, CSS y JavaScript o una arquitectura sencilla equivalente.
- Compatible con GitHub Pages.
- Sin backend.
- Sin autenticación.
- Sin base de datos externa.
- Sin Google Forms.
- Sin Google Sheets.
- Sin pasarelas de pago.
- Sin servicios de pago.
- Sin envío de correos ni mensajes reales.
- Datos de demostración fáciles de editar.
- Registro local de las pruebas.
- Exportación funcional de resultados.
- Responsive para dispositivos móviles y computadora.

Si conviene desarrollarlo como una sola página con distintas secciones interactivas, hacerlo así.

No complicar la arquitectura innecesariamente.

## 8. Funciones que NO necesitamos

No incluir:

- Registro de usuarios.
- Inicio de sesión.
- Carrito de compras.
- Pagos reales.
- Chat entre usuarios.
- Envíos a domicilio.
- Inventario administrado por UNIGLO.
- Verificaciones de identidad simuladas como reales.
- Recomendaciones mediante inteligencia artificial.
- Panel administrativo complejo.

No queremos desarrollar una aplicación definitiva.

## 9. Cómo utilizaremos el MVP

El MVP será presentado individualmente a diferentes personas dentro de nuestro mercado objetivo.

Cada integrante del equipo deberá:

1. Iniciar una sesión de prueba.
2. Pedirle al participante que explore UNIGLO.
3. Observar qué hace sin dirigir demasiado su comportamiento.
4. Registrar las acciones realizadas.
5. Preguntar qué le gustó, qué le preocupó y qué necesitaría para utilizar el servicio.
6. Exportar los resultados.
7. Elaborar una conclusión individual sobre lo aprendido.

La página debe facilitar este proceso.

Queremos distinguir entre:

- Interés declarado.
- Interacción con productos.
- Intención de contactar a un vendedor.
- Intención de publicar una prenda.
- Disposición declarada a aceptar una comisión.

No presentar estas acciones como transacciones o ventas efectivamente realizadas.

## 10. Entregables

Construir y proporcionar:

1. Página web funcional de UNIGLO MVP V1.
2. Todos los archivos necesarios.
3. Proyecto preparado para GitHub Pages.
4. Instrucciones claras de publicación.
5. Modo investigador funcional.
6. Exportación de resultados CSV o JSON.
7. Datos de demostración editables.
8. Instrucciones breves para realizar las pruebas con clientes.

Comprobar que funcionen:

- Navegación.
- Búsqueda y filtros.
- Detalles de prendas.
- Simulación de compra.
- Simulación de publicación.
- Cálculo de comisión.
- Registro de interacciones.
- Exportación de resultados.
- Reinicio de sesiones.

No dar por terminada la página hasta verificar las funcionalidades principales.

## 11. Criterio final de éxito

El éxito del MVP no depende de cuántas funciones tenga ni de qué tan elaborado sea el diseño.

Necesitamos poder responder:

- ¿Los jóvenes realmente exploran el catálogo?
- ¿Qué productos generan más interés?
- ¿Intentarían contactar a un vendedor?
- ¿Qué barreras de confianza siguen presentes?
- ¿Les interesa publicar su propia ropa?
- ¿Aceptarían una comisión por utilizar UNIGLO?
- ¿Existen diferencias entre estudiantes y jóvenes trabajadores?

El objetivo es obtener evidencia inicial que nos ayude a decidir si vale la pena continuar desarrollando UNIGLO y qué aspectos debemos mejorar.

**Construye la versión más sencilla y funcional que permita obtener esos aprendizajes, sin agregar complejidad innecesaria.**