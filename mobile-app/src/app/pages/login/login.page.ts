import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
  LoadingController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  sparklesOutline,
  lockClosedOutline,
  mailOutline,
  logInOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  flashOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonIcon,
    IonToast
  ]
})
export class LoginPage {
  public auth = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);

  email = '';
  password = '';
  errorMessage = signal<string | null>(null);
  toastMessage = signal<string>('');
  isToastOpen = signal<boolean>(false);

  constructor() {
    addIcons({
      sparklesOutline,
      lockClosedOutline,
      mailOutline,
      logInOutline,
      arrowBackOutline,
      checkmarkCircleOutline,
      flashOutline,
      shieldCheckmarkOutline
    });
  }

  async handleLogin(): Promise<void> {
    this.errorMessage.set(null);

    if (!this.email || !this.email.includes('@')) {
      this.errorMessage.set('Informe um formato de e-mail válido (ex: seu@email.com).');
      return;
    }

    if (!this.password || this.password.length < 6) {
      this.errorMessage.set('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Autenticando no Spring Boot...',
      spinner: 'circles'
    });
    await loader.present();

    this.auth.login(this.email.trim(), this.password).subscribe({
      next: async () => {
        await loader.dismiss();
        this.toastMessage.set('✓ Login realizado com sucesso!');
        this.isToastOpen.set(true);
        setTimeout(() => this.router.navigate(['/tabs/jobs']), 500);
      },
      error: async (err) => {
        await loader.dismiss();
        const msg = err?.error?.message || 'E-mail ou senha incorretos.';
        this.errorMessage.set(msg);
      }
    });
  }

  fillDemoUser(): void {
    this.email = 'alvarooliver1802@gmail.com';
    this.password = '123456';
  }

  handleLogout(): void {
    this.auth.logout();
    this.toastMessage.set('✓ Você encerrou sua sessão com sucesso.');
    this.isToastOpen.set(true);
  }
}
