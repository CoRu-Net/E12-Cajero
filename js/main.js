// E12 · Cajero automático: simulación de una sesión
import { validarImporte, esRetirable, calcularComision, desglosarBilletes, LIMITE_RETIRADA } from './cajero.js';

const MAX_OPERACIONES = 10;

const titular = 'Lucía';
const esCliente = false;
let saldo = 250;

// Operaciones tal como las teclea el usuario: los importes llegan como texto.
const operaciones = [
  { tipo: 'consultar' },
  { tipo: 'retirar', importe: '60' },
  { tipo: 'retirar', importe: '72' },
  { tipo: 'ingresar', importe: ' 100,50 ' },
  { tipo: 'retirar', importe: 'cien' },
  { tipo: 'retirar', importe: '300' },
  { tipo: 'transferir', importe: '20' },
  { tipo: 'retirar', importe: '700' },
  { tipo: 'salir' },
  { tipo: 'consultar' },
];

// TODO: muestra el saludo, procesa las operaciones con un bucle y una decisión según el tipo,
// y termina con el resumen. El formato exacto de cada línea está en el enunciado.
const estadoTitular = esCliente ? 'cliente' : 'no cliente';
console.log(`🏧 Bienvenida, ${titular} (${estadoTitular})`);

let contador = 0;

// Utilidad local para la salida: evita imprimir los decimales .00 si es entero
const formatearImporte = (num) => (Number.isInteger(num) ? num.toString() : num.toFixed(2));

for (const op of operaciones) {
  if (op.tipo === 'salir') {
    contador++;
    console.log(`${contador}. salir → 👋 Sesión terminada`);
    break;
  }

  if (contador >= MAX_OPERACIONES) {
    console.log('⚠️ Máximo de operaciones alcanzado');
    break;
  }

  contador++;
  let nombreOperacion = op.tipo;

  switch (op.tipo) {
    case 'consultar':
      console.log(`${contador}. ${nombreOperacion} → Saldo: ${saldo.toFixed(2)} €`);
      break;

    case 'ingresar': {
      const importeValidado = validarImporte(op.importe);
      
      if (importeValidado === null) {
        console.log(`${contador}. ${nombreOperacion} → ❌ Importe no válido: "${op.importe}"`);
      } else {
        saldo += importeValidado;
        console.log(`${contador}. ${nombreOperacion} ${formatearImporte(importeValidado)} € → ✅ Saldo: ${saldo.toFixed(2)} €`);
      }
      break;
    }

    case 'retirar': {
      const importeValidado = validarImporte(op.importe);
      
      if (importeValidado === null) {
        console.log(`${contador}. ${nombreOperacion} → ❌ Importe no válido: "${op.importe}"`);
        break;
      }

      nombreOperacion = `retirar ${formatearImporte(importeValidado)} €`;

      if (!esRetirable(importeValidado)) {
        console.log(`${contador}. ${nombreOperacion} → ❌ Debe ser múltiplo de 5 y no superar ${LIMITE_RETIRADA} €`);
        break;
      }

      const comision = calcularComision(importeValidado, esCliente);
      if (saldo < (importeValidado + comision)) {
        console.log(`${contador}. ${nombreOperacion} → ❌ Saldo insuficiente (comisión: ${comision.toFixed(2)} €)`);
        break;
      }

      saldo -= (importeValidado + comision);
      const desglose = desglosarBilletes(importeValidado);
      console.log(`${contador}. ${nombreOperacion} → ✅ ${desglose} · comisión: ${comision.toFixed(2)} € · saldo: ${saldo.toFixed(2)} €`);
      break;
    }

    default:
      console.log(`${contador}. ${nombreOperacion} → ❌ Operación desconocida`);
      break;
  }
}

console.log(`Operaciones realizadas: ${contador} · saldo final: ${saldo.toFixed(2)} €`);