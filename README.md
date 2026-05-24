# griego-koine

Aplicación local para estudiar griego koiné en español.

## Contenido

- Alfabeto griego: tarjetas, nombre de letra y emparejar mayúscula/minúscula.
- Juan 1: lectura con vocabulario, análisis gramatical, glosario y práctica.
- Progreso persistido en `localStorage`.

## Scripts

- `npm run dev`: servidor de desarrollo.
- `npm run lint`: ESLint.
- `npm run build`: build de producción.
- `npm run check`: lint + build.

## Estructura

- `src/features/alfabeto`: datos y modos de práctica del alfabeto.
- `src/features/juan`: datos, lectura, glosario y práctica de Juan 1.
- `src/shared/modelo`: niveles, sesiones y derivación de vocabulario.
- `src/state`: contexto de progreso y persistencia.

Las claves de progreso son `estudio_alfabeto`, `estudio_juan` y `estudio_verso`.
