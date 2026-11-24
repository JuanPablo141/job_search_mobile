import { Directive, Input, HostBinding } from '@angular/core';

/**
 * Diretiva personalizada 1 (Requisito 5 do projeto)
 * Destaca visualmente o card de vaga conforme a nota de compatibilidade (Match Score).
 * Utiliza @HostBinding para alterar estilos dinamicamente.
 *
 * Exemplo de uso:
 * <ion-card [appMatchHighlight]="job.score">
 */
@Directive({
  selector: '[appMatchHighlight]',
  standalone: true
})
export class MatchHighlightDirective {
  @HostBinding('style.borderLeft') borderLeft = '6px solid #92949c';

  @Input('appMatchHighlight')
  set score(value: number | null | undefined) {
    this.applyHighlight(value);
  }

  private applyHighlight(score: number | null | undefined): void {
    const s = Number(score ?? 0);

    if (s >= 80) {
      // Alta compatibilidade: Verde vibrante (#2dd36f)
      this.borderLeft = '6px solid #2dd36f';
    } else if (s >= 60) {
      // Média aderência: Amarelo/Âmbar (#ffc409)
      this.borderLeft = '6px solid #ffc409';
    } else {
      // Baixa aderência: Cinza neutro (#92949c)
      this.borderLeft = '6px solid #92949c';
    }
  }
}
