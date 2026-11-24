import { Directive, HostBinding, HostListener } from '@angular/core';

/**
 * Diretiva personalizada 2 (Requisito 5 do projeto)
 * Adiciona feedback tátil e elevação suave ao interagir ou passar o cursor sobre os elementos/cards.
 * Utiliza @HostBinding e @HostListener para controle de eventos do DOM.
 *
 * Exemplo de uso:
 * <ion-card appCardHover>
 */
@Directive({
  selector: '[appCardHover]',
  standalone: true
})
export class CardHoverDirective {
  @HostBinding('style.transform') transform = 'translateY(0)';
  @HostBinding('style.boxShadow') boxShadow = '0 10px 25px rgba(0, 0, 0, 0.35)';
  @HostBinding('style.transition') transition = 'transform 0.25s ease, box-shadow 0.25s ease';
  @HostBinding('style.cursor') cursor = 'pointer';

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.elevate();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.reset();
  }

  @HostListener('touchstart')
  onTouchStart(): void {
    this.elevate();
  }

  @HostListener('touchend')
  onTouchEnd(): void {
    this.reset();
  }

  private elevate(): void {
    this.transform = 'translateY(-4px)';
    this.boxShadow = '0 14px 30px rgba(56, 189, 248, 0.22)';
  }

  private reset(): void {
    this.transform = 'translateY(0)';
    this.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.35)';
  }
}
