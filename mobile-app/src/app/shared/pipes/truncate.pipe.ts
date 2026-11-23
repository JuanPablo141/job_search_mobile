import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personalizado 2 (Requisito 3 do projeto)
 * Trunca textos longos de descrições de vagas no card, mantendo o layout limpo.
 * Exemplo de uso no template: {{ job.description | truncate:120 }}
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit: number = 100, trail: string = '...'): string {
    if (!value) return '';

    if (value.length <= limit) {
      return value;
    }

    // Corta até o limite e ajusta para não quebrar a última palavra
    const truncated = value.substring(0, limit);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + trail;
    }

    return truncated + trail;
  }
}
