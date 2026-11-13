import { describe, expect, it, vi, afterEach } from 'vitest';
import { escaparHTML, haceCuanto, htmlLista, tituloPestana } from '../src/vista.js';
const articulo = (propiedades = {}) => ({
  id: 'p1',
  nombre: 'Pan',
  cantidad: 2,
  comprado: false,
  creado: new Date('2026-11-09T10:00:00Z'),
  ...propiedades,
});

describe('vista', () => {
  afterEach(() => vi.useRealTimers());
  it('escapa texto con caracteres HTML peligrosos', () => {
    expect(escaparHTML(`<>&"'`)).toBe('&lt;&gt;&amp;&quot;&#39;');
    expect(htmlLista([articulo({ nombre: '<b>Pan</b>' })])).not.toContain('<b>Pan</b>');
  });
  it('formatea fechas relativas con el reloj controlado', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-09T10:05:00Z'));
    expect(haceCuanto(new Date('2026-11-09T10:00:00Z'), new Date())).toBe('hace 5 minutos');
  });
  it('genera casillas y título según pendientes', () => {
    expect(htmlLista([articulo({ comprado: true })])).toContain('checked');
    expect(tituloPestana([articulo()])).toBe('(1) Lista de la compra');
    expect(tituloPestana([articulo({ comprado: true })])).toBe('✅ Lista de la compra');
  });
});
