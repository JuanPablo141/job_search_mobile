import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('deve criar a instância', () => {
    expect(pipe).toBeTruthy();
  });

  it('não deve truncar textos menores que o limite', () => {
    expect(pipe.transform('Angular Ionic', 20)).toBe('Angular Ionic');
  });

  it('deve truncar textos longos respeitando palavras', () => {
    const text = 'Desenvolvimento de software de alta performance mobile com Ionic e Angular';
    const result = pipe.transform(text, 35);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(35 + 3);
  });

  it('deve tratar valores vazios ou nulos', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
