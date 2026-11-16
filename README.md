# 2048

Una versión web del clásico juego de fichas, con controles para teclado y móvil, una interfaz adaptable y progreso guardado en el navegador. El objetivo es combinar valores iguales hasta alcanzar la ficha 2048.

[Jugar en vivo](https://michael-2048.vercel.app/) · [Repositorio](https://github.com/MichaelAcostaDev/2048)

## El problema y la solución

Los juegos de lógica deben ser fáciles de entender y responder de inmediato, tanto en escritorio como en dispositivos táctiles. Este proyecto reúne las reglas de 2048 en una experiencia ligera: el tablero se actualiza al instante, los controles se adaptan al dispositivo y el progreso permanece disponible entre visitas en el mismo navegador.

## Características principales

- **Tablero 4 × 4:** desplaza las fichas y combina valores iguales para aumentar su puntuación.
- **Controles flexibles:** flechas, WASD y gestos de deslizamiento.
- **Progreso local:** guarda automáticamente el tablero, la puntuación y el mejor resultado en el navegador.
- **Temas claro y oscuro:** el tema claro se carga por defecto y el usuario puede alternar entre ambos.
- **Interfaz bilingüe:** selecciona español o inglés según los idiomas preferidos del dispositivo.
- **Respuesta visual y sonora:** animaciones de desplazamiento, aparición y fusión de fichas, además de sonido opcional.
- **Cierre de partida claro:** al quedarse sin movimientos, muestra un diálogo con la puntuación final y opciones para iniciar otra partida o volver al tablero.
- **Diseño adaptable:** pensado para pantallas de escritorio y móviles; respeta la preferencia del sistema para reducir el movimiento.

## Arquitectura y stack tecnológico

| Componente | Tecnología | Responsabilidad |
| --- | --- | --- |
| Aplicación web | Ruby y Sinatra | Sirve la página, los recursos estáticos y los endpoints JSON del juego. |
| Reglas del juego | Ruby | Mantiene la lógica de movimientos, fusiones, puntuación y fin de partida en `Game2048`. |
| Vista | ERB y HTML | Presenta la estructura de la interfaz y el tablero. |
| Interacción | JavaScript | Gestiona el estado durante la partida, los controles, el renderizado, las traducciones y las animaciones. |
| Sonido | Web Audio API | Genera el efecto sonoro de los movimientos directamente en el navegador. |
| Estilos | CSS | Define los temas, la presentación adaptable y los efectos visuales. |
| Persistencia | `localStorage` | Conserva el progreso y las preferencias en el navegador del usuario. |
| Despliegue | Vercel | Publica la aplicación Ruby mediante la configuración del proyecto. |

La aplicación separa la entrada web de las reglas del juego: `app.rb` define las rutas de Sinatra y `lib/game_logic.rb` contiene la lógica Ruby. En el navegador, JavaScript mantiene una partida interactiva y guarda su estado localmente, evitando una petición al servidor por cada movimiento.

## Decisiones técnicas y retos

- **Stack ligero:** Sinatra y JavaScript sin frameworks adicionales mantienen la aplicación sencilla y adecuada al alcance del juego.
- **Interacción inmediata:** el navegador procesa los movimientos y renderiza los cambios localmente; `localStorage` evita perder el progreso al cerrar o recargar la página.
- **Reglas explícitas:** la lógica Ruby concentra las operaciones de movimiento, fusión, puntuación y detección del fin de partida.
- **Animaciones con contexto:** el desplazamiento conserva el origen de las fichas, mientras que las fusiones y las nuevas fichas reciben efectos propios. Las animaciones también consideran la preferencia de movimiento reducido del sistema.
- **Adaptación al usuario:** el tema y el idioma se ajustan a preferencias claras, sin requerir una configuración inicial.
- **Reto de consistencia:** las reglas se implementan tanto en Ruby como en JavaScript para atender las rutas del servidor y la partida interactiva. Mantener ambas implementaciones alineadas es un punto importante para futuras pruebas.

## Estado del proyecto y mejoras futuras

### Completado

- Juego funcional con movimiento en las cuatro direcciones, fusiones y puntuación.
- Interfaz adaptable con temas claro y oscuro.
- Guardado local del estado de la partida.
- Detección automática de español e inglés.
- Sonido opcional, animaciones y diálogo de fin de partida.

### Roadmap sugerido

- Incorporar pruebas automatizadas para validar las reglas y mantener consistentes las implementaciones de Ruby y JavaScript.
- Añadir una preferencia manual de idioma además de la detección del dispositivo.
- Explorar sincronización del progreso entre dispositivos mediante almacenamiento remoto.
- Ampliar las opciones de accesibilidad y personalización visual.

## Autor

**Michael Acosta**

- [LinkedIn](https://www.linkedin.com/in/michael-acosta-dev/)
- [GitHub](https://github.com/MichaelAcostaDev)
