import { MatchScorePipe } from './match-score.pipe';

describe('MatchScorePipe', () => {
  const pipe = new MatchScorePipe();

  it('deve criar a instância', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve formatar pontuação >= 80 como Alta Compatibilidade', () => {
    expect(pipe.transform(95)).toBe('95% • Alta Compatibilidade');
    expect(pipe.transform(80)).toBe('80% • Alta Compatibilidade');
  });

  it('deve formatar pontuação entre 60 e 79 como Média Aderência', () => {
    expect(pipe.transform(68)).toBe('68% • Média Aderência');
  });

  it('deve formatar pontuação abaixo de 60 como Em Análise', () => {
    expect(pipe.transform(45)).toBe('45% • Em Análise');
  });

  it('deve tratar valores nulos ou indefinidos', () => {
    expect(pipe.transform(null)).toBe('0% • Sem Avaliação');
    expect(pipe.transform(undefined)).toBe('0% • Sem Avaliação');
  });
});
