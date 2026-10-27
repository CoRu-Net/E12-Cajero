import { describe, it, expect } from 'vitest';
import { validarImporte, esRetirable, calcularComision, desglosarBilletes } from './cajero.js';

describe('validarImporte', () => {
  it('convierte importes con comas, puntos y espacios periféricos', () => {
    expect(validarImporte(' 100,50 ')).toBe(100.5);
    expect(validarImporte(' 20.5')).toBe(20.5);
    expect(validarImporte('  40 ')).toBe(40);
  });
  
  it('devuelve null con cadenas vacías, texto no numérico o valores negativos/cero', () => {
    expect(validarImporte('')).toBeNull();
    expect(validarImporte('   ')).toBeNull();
    expect(validarImporte('cien')).toBeNull();
    expect(validarImporte('0')).toBeNull();
    expect(validarImporte('-20')).toBeNull();
  });
});

describe('esRetirable', () => {
  it('devuelve true para múltiplos de 5 hasta el límite de 600', () => {
    expect(esRetirable(60)).toBe(true);
    expect(esRetirable(600)).toBe(true);
  });
  
  it('devuelve false para cantidades no válidas o superiores al límite', () => {
    expect(esRetirable(72)).toBe(false); // No es múltiplo
    expect(esRetirable(700)).toBe(false); // Supera el límite
    expect(esRetirable(62.5)).toBe(false); // No es entero
    expect(esRetirable(0)).toBe(false); 
    expect(esRetirable(-10)).toBe(false); 
  });
});

describe('calcularComision', () => {
  it('devuelve 0 si la tarjeta es del propio banco (cliente)', () => {
    expect(calcularComision(300, true)).toBe(0);
    expect(calcularComision(60, true)).toBe(0);
  });
  
  it('calcula la comisión para no clientes (2% del importe o mínimo de 1.50)', () => {
    expect(calcularComision(60, false)).toBe(1.5); // 2% de 60 es 1.2 -> sube a mínimo 1.5
    expect(calcularComision(50, false)).toBe(1.5); // 2% de 50 es 1.0 -> sube a mínimo 1.5
    expect(calcularComision(300, false)).toBe(6);  // 2% de 300 es 6.0
  });
});

describe('desglosarBilletes', () => {
  it('devuelve el desglose en el menor número de billetes posible', () => {
    expect(desglosarBilletes(60)).toBe('1 x 50 € + 1 x 10 €');
    expect(desglosarBilletes(185)).toBe('3 x 50 € + 1 x 20 € + 1 x 10 € + 1 x 5 €');
    expect(desglosarBilletes(50)).toBe('1 x 50 €');
  });
  
  it('devuelve una cadena vacía si el importe es 0', () => {
    expect(desglosarBilletes(0)).toBe('');
  });
});