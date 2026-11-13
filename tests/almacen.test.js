import { describe, expect, it, vi } from 'vitest';
import { cargar, guardar } from '../src/almacen.js';
import { AlmacenFalso } from './AlmacenFalso.js';

describe('almacen', () => {
  it('guarda/carga fechas como Date y descarta artículos inválidos', () => {
    const almacen = new AlmacenFalso();
    const creado = new Date('2026-01-01T10:00:00Z');
    expect(
      guardar([{ id: 'a', nombre: 'Pan', cantidad: 1, comprado: false, creado }], almacen),
    ).toBe(true);
    const recuperados = cargar(almacen);
    expect(recuperados[0].creado).toBeInstanceOf(Date);
    expect(recuperados[0].creado.toISOString()).toBe(creado.toISOString());
    almacen.setItem(
      'lista-compra',
      JSON.stringify({
        version: 1,
        articulos: [
          { id: 'ok', nombre: 'Pan', cantidad: 1, comprado: false, creado },
          { id: 'bad' },
        ],
      }),
    );
    expect(cargar(almacen)).toHaveLength(1);
  });
  it.each(['{', '{"version":2,"articulos":[]}'])(
    'retorna lista vacía con datos erróneos %s',
    (texto) => {
      const almacen = new AlmacenFalso();
      almacen.setItem('lista-compra', texto);
      expect(cargar(almacen)).toEqual([]);
    },
  );
  it('informa si el almacenamiento falla', () => {
    const spy = vi.fn(() => {
      throw new Error('lleno');
    });
    expect(guardar([], { setItem: spy })).toBe(false);
    expect(spy).toHaveBeenCalledOnce();
  });
});
