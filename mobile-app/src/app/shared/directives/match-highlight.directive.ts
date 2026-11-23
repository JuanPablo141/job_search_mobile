import { Directive, Input, HostBinding, OnChanges, SimpleChanges } from '@angular/core';

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
export class MatchHighlightDirective implements OnChanges {
  @Input('appMatchHighlight') score: number | null | undefined = 0;

  @HostBinding('style.borderLeft') borderLeft = '6px solid #92949c';
  @HostBinding('style.transition') transition = 'all 0.3s ease-in-out';
  @HostBinding('style.boxShadow') boxShadow = '0 2px 6px rgba(0,0,0,0.06)';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['score']) {
      this.applyHighlight();
    }
  }

  private applyHighlight(): void {
    const s = this.score ?? 0;

    if (s >= 80) {
      // Alta compatibilidade: Verde vibrante (#2dd36f) com leve brilho
      this.borderLeft = '6px solid #2dd36f';
      this.boxShadow = '0 3px 8px rgba(45, 211, 111, 0.15)';
    } else if (s >= 60) {
      // Média aderência: Amarelo/Laranja (#ffc409)
      this.borderLeft = '6px solid #ffc409';
      this.boxShadow = '0 3px 8px rgba(255, 196, 9, 0.12)';
    } else {
      // Baixa aderência: Cinza neutro
      this.borderLeft = '6px solid #92949c';
      this.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
    }
  }
}
