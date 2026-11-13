import { describe, expect, it } from 'vitest';
import { enlaceCompartir, leerCompartidos } from '../src/compartir.js';
describe('compartir', () => {
  it('codifica y recupera artículos pendientes', () => {
    const url = enlaceCompartir('https://ejemplo.test/', [
      { nombre: 'Café & té', cantidad: 2, comprado: false },
      { nombre: 'sal', cantidad: 5, comprado: true },
    ]);
    expect(url).toContain('compartir=Caf%C3%A9+%26+t%C3%A9*2');
    expect(leerCompartidos(new URL(url).search)).toEqual([{ nombre: 'Café & té', cantidad: 2 }]);
  });
  it('omite entradas vacías y cantidades incorrectas', () => {
    expect(leerCompartidos('?compartir=pan,leche*3,,agua*0')).toEqual([
      { nombre: 'pan', cantidad: 1 },
      { nombre: 'leche', cantidad: 3 },
    ]);
  });
});
