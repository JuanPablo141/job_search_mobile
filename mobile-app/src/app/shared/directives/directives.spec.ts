import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatchHighlightDirective } from './match-highlight.directive';
import { CardHoverDirective } from './card-hover.directive';

@Component({
  standalone: true,
  imports: [MatchHighlightDirective, CardHoverDirective],
  template: `
    <div id="highScore" [appMatchHighlight]="90" appCardHover>High Match</div>
    <div id="midScore" [appMatchHighlight]="65">Mid Match</div>
    <div id="lowScore" [appMatchHighlight]="40">Low Match</div>
  `
})
class TestHostComponent {}

describe('Diretivas Customizadas', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('deve aplicar borda verde para score alto (>= 80)', () => {
    const el = fixture.debugElement.query(By.css('#highScore')).nativeElement;
    expect(el.style.borderLeft).toContain('solid rgb(45, 211, 111)');
  });

  it('deve aplicar borda amarela para score médio (>= 60)', () => {
    const el = fixture.debugElement.query(By.css('#midScore')).nativeElement;
    expect(el.style.borderLeft).toContain('solid rgb(255, 196, 9)');
  });

  it('deve aplicar borda cinza para score baixo (< 60)', () => {
    const el = fixture.debugElement.query(By.css('#lowScore')).nativeElement;
    expect(el.style.borderLeft).toContain('solid rgb(146, 148, 156)');
  });

  it('deve elevar elemento no mouseenter com CardHoverDirective', () => {
    const debugEl = fixture.debugElement.query(By.css('#highScore'));
    debugEl.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    expect(debugEl.nativeElement.style.transform).toBe('translateY(-4px)');

    debugEl.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
    expect(debugEl.nativeElement.style.transform).toBe('translateY(0px)');
  });
});
