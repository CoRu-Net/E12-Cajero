# E12 · Cajero automático (integrador)

**Tipo:** corrección por IA

Programa de consola que simula una sesión en un cajero automático: valida importes escritos por el usuario, calcula comisiones, desglosa billetes y procesa una lista de operaciones. Junta todo lo visto en la unidad.

**CE:** RA2 a, b, c, d, e, f, g, h

## Entorno de trabajo

Este ejercicio trae su Dev Container en `.devcontainer/`. A diferencia de los anteriores, no usa una imagen preparada para Dev Containers: **construye la suya** con el `Dockerfile` de esa carpeta, a partir de la imagen oficial de Node.js de **Docker Hub**, `node:24-bookworm` (tema 9, apartado 9.3.2). Abre en VS Code **la carpeta del ejercicio**, la que contiene `.devcontainer/` (no una carpeta superior, como la del repositorio del curso: VS Code solo busca el Dev Container en la carpeta que abres), y ejecuta **Dev Containers: Reopen in Container**. Si VS Code te ofrece crear una configuración nueva, es que has abierto otra carpeta. La primera vez tarda algo más, porque descarga la imagen y la construye. Al crearse, el contenedor ejecuta `npm install`: cuando se abre, las dependencias ya están instaladas.

Ejecuta los programas en la terminal de VS Code, que ya es la del contenedor.

## Punto de partida

El repositorio ya tiene la estructura del proyecto:

```text
├── .devcontainer/      ← Dev Container: devcontainer.json y Dockerfile (no hay que tocarlo)
├── index.html          ← carga js/main.js como módulo (no hay que tocarlo)
├── package.json        ← scripts start, test, lint, format y format:check
├── eslint.config.js    ← configuración del curso (no se modifica)
├── .prettierrc
├── js/
│   ├── cajero.js       ← constantes y cuatro funciones con su JSDoc, sin programar
│   ├── main.js         ← datos de la sesión, sin programar
│   └── cajero.test.js  ← lo creas tú: tests de las cuatro funciones
└── README.md           ← plantilla de entrega
```

## Requisitos

**`js/cajero.js`**: programa las cuatro funciones según su JSDoc y el contrato (abajo). No muestran nada por consola: reciben datos y devuelven un resultado.

1. `validarImporte(texto)` convierte el texto en número. Admite espacios alrededor y coma o punto decimal. Devuelve `null` si el texto está vacío, no es un número o no es mayor que 0.
2. `esRetirable(importe)` indica si el cajero puede entregar ese importe: debe ser un entero múltiplo de 5 y no superar `LIMITE_RETIRADA`.
3. `calcularComision(importe, esCliente)`: los clientes no pagan comisión. El resto paga el `COMISION_NO_CLIENTE` % del importe, con un mínimo de `COMISION_MINIMA` €, redondeado a céntimos.
4. `desglosarBilletes(importe)` reparte el importe en el menor número de billetes de `BILLETES`, recorriéndolos con un bucle, y devuelve un texto como `1 x 50 € + 1 x 10 €`.

**`js/main.js`**: procesa la sesión.

5. Muestra el saludo y recorre `operaciones` con un bucle. Cada operación se numera desde 1.
6. Decide qué hacer según el tipo con un **`switch`**: `consultar`, `ingresar`, `retirar` y cualquier otro tipo (operación desconocida).
7. Con `salir`, la sesión termina **inmediatamente**: las operaciones siguientes no se procesan. Ojo: un `break` dentro de un `case` termina el `switch`, no el bucle (tema 8, apartado 8.7). Comprueba `salir` antes del `switch`.
8. Si se alcanzan `MAX_OPERACIONES`, la sesión también termina y se muestra `⚠️ Máximo de operaciones alcanzado` antes del resumen.
9. Una retirada se rechaza si el importe no es válido, si no es retirable o si el saldo no cubre el importe **más la comisión**. Si se acepta, se descuentan las dos cosas del saldo.
10. Al final, muestra el número de operaciones procesadas y el saldo final.

**En todo el proyecto**:

11. `const` por defecto, `let` solo si hay reasignación, nada de `var`, y cada variable en el ámbito más pequeño posible.
12. Comparaciones con `===` y `!==`. Conversiones de tipo explícitas.
13. Comentarios que expliquen el porqué donde el código no lo deja claro. Mantén y completa el JSDoc.
14. `npm run lint` sin errores y código formateado con Prettier (`npm run format:check`).
15. Escribe `js/cajero.test.js` con **tests unitarios** de las cuatro funciones (tema 9, apartados 9.8.4 y 9.8.5): un `describe` por función y **al menos dos tests en cada uno** (diez o más en total), con casos normales, **casos límite** y entradas no válidas. Los ejemplos del contrato son un buen punto de partida, pero no bastan: añade los límites (el importe máximo, el mínimo de comisión, texto vacío o solo espacios…). Ejecútalos con `npm test`. Prueba también, a mano, la sesión con una lista de operaciones **sin `salir`** y con más de `MAX_OPERACIONES`, para comprobar el límite, y deja después los datos como estaban.
16. Completa el `README.md` siguiendo los comentarios de la plantilla.
17. Haz varios commits a medida que avances, con mensajes que expliquen cada cambio.

## Salida esperada

Con los datos de `main.js`, `npm start` muestra exactamente:

```text
🏧 Bienvenida, Lucía (no cliente)
1. consultar → Saldo: 250.00 €
2. retirar 60 € → ✅ 1 x 50 € + 1 x 10 € · comisión: 1.50 € · saldo: 188.50 €
3. retirar 72 € → ❌ Debe ser múltiplo de 5 y no superar 600 €
4. ingresar 100.50 € → ✅ Saldo: 289.00 €
5. retirar → ❌ Importe no válido: "cien"
6. retirar 300 € → ❌ Saldo insuficiente (comisión: 6.00 €)
7. transferir → ❌ Operación desconocida
8. retirar 700 € → ❌ Debe ser múltiplo de 5 y no superar 600 €
9. salir → 👋 Sesión terminada
Operaciones realizadas: 9 · saldo final: 289.00 €
```

## Contrato de entrega

La corrección busca estos elementos exactamente aquí. **Respétalos**:

| Elemento | Debe ser |
|----------|----------|
| Ficheros | `index.html`, `package.json`, `eslint.config.js`, `js/cajero.js`, `js/main.js`, `js/cajero.test.js`, `README.md` |
| Exportaciones de `js/cajero.js` | `BILLETES`, `LIMITE_RETIRADA`, `COMISION_NO_CLIENTE`, `COMISION_MINIMA` (con los valores del código de partida) y las funciones `validarImporte(texto)`, `esRetirable(importe)`, `calcularComision(importe, esCliente)` y `desglosarBilletes(importe)` |
| `validarImporte` | Devuelve un `number` o `null`. Ejemplos: `' 100,50 '` → `100.5`; `''`, `'cien'`, `'0'`, `'-20'` → `null` |
| `esRetirable` | Devuelve un `boolean`. Ejemplos: `60` → `true`; `72`, `700`, `62.5` → `false`; `600` → `true` |
| `calcularComision` | Devuelve un `number` en euros. Ejemplos: `(60, false)` → `1.5`; `(300, false)` → `6`; `(300, true)` → `0` |
| `desglosarBilletes` | Devuelve un `string`. Ejemplos: `60` → `'1 x 50 € + 1 x 10 €'`; `185` → `'3 x 50 € + 1 x 20 € + 1 x 10 € + 1 x 5 €'` |
| `npm start` | La salida esperada, línea a línea |
| `npm test` | Ejecuta `js/cajero.test.js` (ya está en `package.json`) y pasan todos los tests |
| Secciones del README | `## Por qué JavaScript`, `## Cómo ejecutarlo`, `## Decisiones de diseño`, `## Conversiones y validación`, `## Pruebas realizadas`, `## Herramientas` |
| Integración continua | **Opcional**: `.github/workflows/ci.yml` y la sección `## Integración continua (opcional)` del README. No se corrige |

## Criterios de evaluación

- ✅ La elección del lenguaje está justificada con criterios
- ✅ Variables, constantes, tipos y operadores bien elegidos
- ✅ Cada variable en su ámbito, y explicado en la tabla de decisiones
- ✅ Los importes de texto se convierten y validan de forma explícita
- ✅ Decisiones con `switch`, `if` y cláusulas de guarda bien usadas
- ✅ Bucles correctos: sesión con salida anticipada y desglose de billetes
- ✅ La sesión produce la salida esperada
- ✅ Comentarios útiles y JSDoc completo
- ✅ Tests unitarios de las cuatro funciones con casos límite, ESLint sin errores y formato con Prettier
- ✅ Historial de commits progresivo y con mensajes descriptivos

## Integración continua (opcional)

> 📝 Este apartado es **opcional** y no cuenta para la corrección. Hazlo si en clase habéis visto GitHub Actions; si no, sáltatelo.

Tu repositorio de la tarea ya está en GitHub. Escribe un *workflow* de GitHub Actions que pase **todas las comprobaciones del proyecto** cada vez que subas cambios. Escríbelo tú, en `.github/workflows/ci.yml`, con estas orientaciones:

- Se ejecuta con cada `push` y cada *pull request* a la rama `main`.
- Tiene un único trabajo (*job*) que se ejecuta en `ubuntu-latest`.
- Sus pasos, en este orden, cada uno con un nombre (`name`) en español que diga qué hace:
  1. Descargar el código, con la acción `actions/checkout@v7`.
  2. Instalar Node.js 24, con la acción `actions/setup-node@v7` y `node-version: 24`.
  3. Instalar las dependencias con `npm install`. El proyecto no tiene `package-lock.json`, así que no uses `npm ci`.
  4. Revisar el código con ESLint: `npm run lint`.
  5. Comprobar el formato con Prettier: `npm run format:check`.
  6. Ejecutar los tests: `npm test`.
- Prettier también revisa el formato de `ci.yml`: ejecuta `npm run format` antes de subirlo.

Compruébalo:

1. Sube los cambios y abre la pestaña **Actions** del repositorio: la ejecución debe salir en verde, con los seis pasos.
2. Rompe algo a propósito (por ejemplo, cambia el valor esperado de un test de `calcularComision`), sube el cambio y comprueba que la ejecución sale en rojo en el paso que corresponde. Después, deshaz el cambio y comprueba que vuelve a verde.

Deja constancia en la sección «Integración continua (opcional)» del `README.md`: el enlace a la ejecución en verde y dos capturas en `img/`, una de la ejecución en verde con sus pasos y otra de la ejecución en rojo con el paso que falla.

## Al terminar

Cuando acabes la práctica, **borra su contenedor**. Si no, sigue en marcha ocupando memoria, y se acumula uno por cada ejercicio (UD1, tema 5, apartado 5.4.7). Tu trabajo no se borra: está en la carpeta del ejercicio.

1. Cierra la ventana de VS Code del ejercicio.
2. En una terminal de tu equipo (en Windows, PowerShell), borra todos los contenedores de Dev Containers. La orden solo toca los que ha creado VS Code, no otros contenedores que tengas:

   ```bash
   docker rm -f $(docker ps -aq --filter label=devcontainer.local_folder)
   ```

   Si no queda ninguno, Docker avisa de que le falta un argumento: puedes ignorarlo. También puedes borrarlos desde Docker Desktop, en la pestaña **Containers**.

La imagen que ha construido el `Dockerfile` tampoco se borra (se llama `vsc-` seguido del nombre de la carpeta), así que la próxima vez no hace falta construirla de nuevo. Si necesitas espacio, bórrala desde la pestaña **Images** de Docker Desktop o con `docker image rm <nombre>`.
