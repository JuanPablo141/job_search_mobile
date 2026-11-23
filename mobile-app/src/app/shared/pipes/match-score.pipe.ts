import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizado 1 (Requisito 3 do projeto)
 * Transforma o score numérico de match (0 a 100) em um rótulo legível e profissional.
 * Exemplo de uso no template: {{ job.score | matchScore }}
 * Saída: "92% • Alta Compatibilidade"
 */
@Pipe({
  name: 'matchScore',
  standalone: true
})
export class MatchScorePipe implements PipeTransform {
  transform(score: number | null | undefined): string {
    if (score === null || score === undefined || isNaN(score)) {
      return '0% • Sem Avaliação';
    }

    const rounded = Math.round(score);

    if (rounded >= 80) {
      return `${rounded}% • Alta Compatibilidade`;
    } else if (rounded >= 60) {
      return `${rounded}% • Média Aderência`;
    } else {
      return `${rounded}% • Em Análise`;
    }
  }
}
