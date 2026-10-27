# Cajero automático

## Por qué JavaScript

Este proyecto se ha desarrollado en JavaScript debido a su ejecución directa e inmediata en entornos de ejecución como Node.js y los navegadores web sin necesidad de una fase previa de compilación. Además, el tipado dinámico y la sintaxis flexible de JavaScript permiten prototipar la lógica del cajero automático y manipular cadenas o números de forma ágil durante el desarrollo. En un escenario real de producción bancaria con un equipo extenso de desarrolladores, se justificaría el cambio a TypeScript para añadir tipado estático, evitar errores en tiempo de ejecución al manejar importes y definir interfaces estrictas para cada tipo de transacción.

## Cómo ejecutarlo

Para instalar las dependencias, ejecutar la simulación y pasar las verificaciones de código, utiliza los siguientes comandos en la terminal:

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar la sesión del cajero en Node.js
npm start

# 3. Revisar el código con ESLint
npm run lint

# 4. Comprobar el formato del código con Prettier
npm run format:check

# 5. Ejecutar los tests unitarios con Vitest
npm test
```

Para verlo en el navegador, abre el archivo `index.html` (por ejemplo, con la extensión *Live Server* de VS Code o abriendo el fichero directamente) y abre la consola de las Herramientas de desarrollo (*DevTools*, tecla F12).

## Decisiones de diseño

| Nombre | Fichero | Declaración | Ámbito | Por qué |
|--------|---------|-------------|--------|---------|
| `BILLETES` | `cajero.js` | `const` | Módulo | Es un array de constantes numéricas con los billetes disponibles. No cambia durante la ejecución y se exporta para uso global. |
| `LIMITE_RETIRADA` | `cajero.js` | `const` | Módulo | Representa la regla fija del importe máximo por retirada, por lo que su valor es inalterable. |
| `saldo` | `main.js` | `let` | Módulo | Representa el saldo de la cuenta del cliente y debe reasignarse al realizar ingresos o retiradas. |
| `contador` | `main.js` | `let` | Módulo | Lleva la cuenta de las operaciones procesadas y se incrementa en cada paso del bucle. |
| `importeValidado` | `main.js` | `const` | Bloque (`case 'ingresar'` / `'retirar'`) | Guarda el importe numérico ya validado dentro del caso correspondiente del `switch` sin peligro de reasignación. |
| `comision` | `main.js` | `const` | Bloque (`case 'retirar'`) | Almacena el cálculo de la comisión aplicable a una retirada concreta sin modificar su valor durante dicha transacción. |

## Conversiones y validación

La función `validarImporte(texto)` procesa las entradas de la siguiente manera:

- **`' 100,50 '`**: Elimina espacios implícitamente o con `.trim()`, reemplaza la coma `,` por el punto decimal `.`, quedando `'100.50'`, y mediante `Number('100.50')` devuelve el número `100.5`.
- **`''`**: La cadena vacía se detecta explícitamente al inicio (`texto.trim() === ''`) y devuelve `null`. Se comprueba aparte porque `Number('')` devuelve `0`, lo cual daría un falso positivo si no se filtrara antes.
- **`'cien'`**: Al intentar convertir la cadena con `Number('cien')`, el resultado es `NaN`. La función verifica `Number.isNaN()` y devuelve `null`.
- **`'-20'`**: Se convierte en el número `-20`. Al evaluar `numero <= 0`, la función determina que no es un importe positivo válido y devuelve `null`.
- **`'  40 '`**: Elimina los espacios y convierte la cadena a `40`, devolviendo el número `40`.

No se utiliza `parseFloat` porque esta función es permisiva y acepta cadenas que empiezan por números seguidos de texto (por ejemplo, `parseFloat('40euros')` devolvería `40`), mientras que `Number()` o la conversión estricta falla si la cadena completa no es un número válido.

## Pruebas realizadas

Salida de `npm test`:

```text
 ✓ js/cajero.test.js (8 tests)

 Test Files  1 passed (1)
      Tests  8 passed (8)
```

| Función | Casos límite que pruebo | Por qué |
|---------|-------------------------|---------|
| `validarImporte` | `''`, `'   '`, `'cien'`, `'0'`, `'-20'`, `' 100,50 '` | Comprueba que se rechacen cadenas vacías, espacios, textos no numéricos y valores menores o iguales a cero, aceptando formatos válidos con coma decimal y espacios. |
| `esRetirable` | `600` (límite máximo), `700` (supera límite), `72` (no múltiplo de 5), `62.5` (decimal), `0` y `-10` | Asegura que solo se permitan enteros positivos que sean múltiplos de 5 y no excedan el máximo permitido por la máquina. |
| `calcularComision` | `(60, false)`, `(300, false)`, `(300, true)` | Verifica que a los clientes se les aplique 0 € de comisión, que a no clientes se les aplique el mínimo de 1.50 € en retiradas pequeñas (2% de 60 = 1.20 € → 1.50 €) y el porcentaje correcto en cantidades mayores. |
| `desglosarBilletes` | `0` (cadena vacía), `50` (un solo billete), `60` (dos billetes) y `185` (uso de los cuatro tipos de billetes) | Garantiza el desglose optimizado usando el menor número de billetes posible y el comportamiento correcto con importe nulo. |

**Prueba de sesión sin `salir` que alcanza `MAX_OPERACIONES`:**
Se sustituyó temporalmente el array `operaciones` en `main.js` por una lista de 12 operaciones de consulta e ingreso sin incluir el comando `'salir'`. El programa procesó las primeras 10 operaciones y mostró por consola:

```text
⚠️ Máximo de operaciones alcanzado
Operaciones realizadas: 10 · saldo final: 1250.00 €
```

Esto confirmó que el control de límite finaliza la sesión adecuadamente sin procesar las operaciones 11 y 12.

## Herramientas

Salida de `npm run lint`:
*(Sin errores ni advertencias en la salida)*

Salida de `npm run format:check`:
```text
Checking formatting...
All matched files use Prettier code style!
```

**Incidencia durante el desarrollo:**
Durante la implementación de `retirar` en `main.js`, ESLint mostró el error `'LIMITE_RETIRADA' is not defined (eslint no-undef)` en la línea que imprimía el mensaje de rechazo por superar el máximo. Al revisar el archivo, vi que la constante estaba definida y exportada en `cajero.js`, pero no se había incluido en la sentencia `import` de `main.js`. Lo solucioné añadiendo `LIMITE_RETIRADA` dentro de las llaves del `import` al principio de `main.js`.