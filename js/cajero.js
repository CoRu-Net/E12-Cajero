/**
 * Funciones del cajero automático: validar importes, calcular comisiones y desglosar billetes.
 * No muestran nada por consola: reciben datos y devuelven resultados.
 */

/** @type {number[]} Billetes que entrega el cajero, de mayor a menor valor. */
export const BILLETES = [50, 20, 10, 5];

/** @type {number} Importe máximo de una retirada, en euros. */
export const LIMITE_RETIRADA = 600;

/** @type {number} Porcentaje de comisión para quien no es cliente del banco. */
export const COMISION_NO_CLIENTE = 2;

/** @type {number} Comisión mínima para quien no es cliente, en euros. */
export const COMISION_MINIMA = 1.5;

/**
 * Convierte el importe escrito por el usuario en un número válido.
 *
 * Admite espacios alrededor y coma o punto como separador decimal.
 *
 * @param {string} texto Importe tal como lo escribe el usuario.
 * @returns {number|null} El importe como número, o `null` si está vacío, no es un número o no es positivo.
 */
export function validarImporte(texto) {
  if (typeof texto !== 'string') return null;

  const limpio = texto.trim().replace(',', '.');
  if (limpio === '') return null;

  const numero = Number(limpio);
  if (Number.isNaN(numero) || numero <= 0) return null;

  return numero;
}

/**
 * Indica si el cajero puede entregar un importe con sus billetes.
 *
 * @param {number} importe Importe que se quiere retirar, en euros.
 * @returns {boolean} `true` si es un entero múltiplo de 5 y no supera LIMITE_RETIRADA.
 */
export function esRetirable(importe) {
  return (
    importe > 0 && Number.isInteger(importe) && importe % 5 === 0 && importe <= LIMITE_RETIRADA
  );
}

/**
 * Calcula la comisión de una retirada.
 *
 * Los clientes del banco no pagan comisión. El resto paga COMISION_NO_CLIENTE %
 * del importe, con un mínimo de COMISION_MINIMA euros.
 *
 * @param {number} importe Importe retirado, en euros.
 * @param {boolean} esCliente Si la tarjeta es del propio banco.
 * @returns {number} Comisión en euros, redondeada a céntimos.
 */
export function calcularComision(importe, esCliente) {
  if (esCliente) return 0;

  const comision = (importe * COMISION_NO_CLIENTE) / 100;
  const comisionFinal = Math.max(comision, COMISION_MINIMA);

  return Number(comisionFinal.toFixed(2));
}

/**
 * Desglosa un importe en el menor número de billetes posible.
 *
 * @param {number} importe Importe retirable (ver esRetirable).
 * @returns {string} Desglose con el formato `2 x 50 € + 1 x 20 €`, o texto vacío si el importe es 0.
 */
export function desglosarBilletes(importe) {
  if (importe === 0) return '';

  let restante = importe;
  const resultado = [];

  for (const billete of BILLETES) {
    if (restante >= billete) {
      const cantidad = Math.floor(restante / billete);
      resultado.push(`${cantidad} x ${billete} €`);
      restante %= billete;
    }
  }

  return resultado.join(' + ');
}
