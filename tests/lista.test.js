import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  anadir,
  alternarComprado,
  quitar,
  quitarComprados,
  ordenar,
  resumen,
} from '../src/lista.js';

describe('anadir', () => {
  it('rechaza un nombre vacío', () => {
    expect(() => anadir([], '   ')).toThrow('El nombre no puede estar vacío');
  });

  it('fusiona sin distinguir mayúsculas ni tildes y no modifica la lista', () => {
    const original = [{ id: '1', nombre: 'Café', cantidad: 1, comprado: true, creado: new Date() }];
    const resultado = anadir(original, ' CAFE ', 2);
    expect(resultado[0]).toMatchObject({ nombre: 'Café', cantidad: 3, comprado: false });
    expect(original[0].cantidad).toBe(1);
  });
  it('limita la fusión a 99 y rechaza cantidades inválidas', () => {
    const lista = anadir([], 'Arroz', 99);
    expect(anadir(lista, 'arroz', 1)[0].cantidad).toBe(100);
    for (const n of [0, 100, 1.5]) expect(() => anadir([], 'x', n)).toThrow(RangeError);
  });
});

describe('operaciones y resumen', () => {
  afterEach(() => vi.useRealTimers());
  it('devuelve listas nuevas al cambiar o borrar artículos', () => {
    const articulos = [
      { id: '1', nombre: 'Leche', cantidad: 1, comprado: false, creado: new Date() },
    ];
    expect(alternarComprado(articulos, '1')[0].comprado).toBe(true);
    expect(quitar(articulos, '1')).toEqual([]);
    expect(quitarComprados([{ ...articulos[0], comprado: true }])).toEqual([]);
    expect(articulos).toHaveLength(1);
  });
  it('ordena pendientes primero y utiliza texto singular/plural', () => {
    const lista = [
      { id: '1', nombre: 'zumo', comprado: false },
      { id: '2', nombre: 'Árbol', comprado: true },
      { id: '3', nombre: 'Café', comprado: false },
    ];
    expect(ordenar(lista).map((a) => a.nombre)).toEqual(['Café', 'zumo', 'Árbol']);
    expect(resumen([])).toBe('La lista está vacía');
    expect(resumen([{ comprado: false }])).toBe('1 artículo · 0 comprados');
    expect(resumen([{ comprado: true }, { comprado: false }])).toBe('2 artículos · 1 comprado');
  });
  it('permite fijar el reloj de las fechas por defecto', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-02T00:00:00Z'));
    const creada = anadir([], 'Pan')[0].creado;
    expect(creada.toISOString()).toBe('2026-01-02T00:00:00.000Z');
  });
});
