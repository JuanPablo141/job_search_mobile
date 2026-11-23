import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonToast
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  sparklesOutline,
  briefcaseOutline,
  logInOutline,
  personAddOutline,
  logOutOutline,
  checkmarkCircleOutline,
  timeOutline,
  shieldCheckmarkOutline,
  ribbonOutline,
  arrowForwardOutline,
  codeSlashOutline,
  colorPaletteOutline,
  analyticsOutline,
  megaphoneOutline,
  cloudOutline,
  globeOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.page.html',
  styleUrls: ['./init.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonToast
  ]
})
export class InitPage {
  public auth = inject(AuthService);
  private router = inject(Router);

  toastMessage = '';
  isToastOpen = false;

  constructor() {
    addIcons({
      sparklesOutline,
      briefcaseOutline,
      logInOutline,
      personAddOutline,
      logOutOutline,
      checkmarkCircleOutline,
      timeOutline,
      shieldCheckmarkOutline,
      ribbonOutline,
      arrowForwardOutline,
      codeSlashOutline,
      colorPaletteOutline,
      analyticsOutline,
      megaphoneOutline,
      cloudOutline,
      globeOutline
    });
  }

  handleLogout(): void {
    this.auth.logout();
    this.toastMessage = 'Você encerrou sua sessão com sucesso!';
    this.isToastOpen = true;
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
