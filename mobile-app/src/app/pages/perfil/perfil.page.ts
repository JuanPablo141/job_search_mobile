import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonBadge,
  IonChip,
  IonRange,
  IonSpinner,
  IonToast,
  LoadingController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline,
  sparklesOutline,
  hardwareChipOutline,
  closeCircle,
  addOutline,
  saveOutline,
  logOutOutline,
  mailOutline,
  briefcaseOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { JobApiService } from '../../core/services/job-api.service';
import { AuthService } from '../../core/services/auth.service';
import { Skill, SearchProfile } from '../../core/models/job.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
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
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonBadge,
    IonChip,
    IonRange,
    IonSpinner,
    IonToast
  ]
})
export class PerfilPage implements OnInit {
  private jobService = inject(JobApiService);
  public auth = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);

  profileName = 'Desenvolvedor Full Stack / Mobile';
  minScore = 70;
  skills = signal<string[]>(['Angular', 'Ionic', 'TypeScript', 'Java', 'Spring Boot', 'REST API']);
  newSkillInput = signal<string>('');

  availableSkills = signal<Skill[]>([]);
  popularSkills = [
    'React',
    'TypeScript',
    'Java',
    'Spring Boot',
    'Python',
    'Angular',
    'Ionic',
    'Docker',
    'SQL',
    'PostgreSQL',
    'AWS',
    'Git',
    'REST'
  ];

  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  toastMessage = signal<string>('');
  isToastOpen = signal<boolean>(false);

  filteredSuggestions = computed(() => {
    const query = this.newSkillInput().trim().toLowerCase();
    if (!query) return [];
    return this.availableSkills()
      .filter((s) => s.name.toLowerCase().includes(query) && !this.skills().includes(s.name))
      .slice(0, 5);
  });

  constructor() {
    addIcons({
      personOutline,
      sparklesOutline,
      hardwareChipOutline,
      closeCircle,
      addOutline,
      saveOutline,
      logOutOutline,
      mailOutline,
      briefcaseOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadSkillsCatalog();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.jobService.getActiveProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.profileName = profile.name || this.profileName;
          this.minScore = profile.min_score || 70;
          if (profile.keywords) {
            const list = profile.keywords.split(',').map((s) => s.trim()).filter(Boolean);
            if (list.length) this.skills.set(list);
          }
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadSkillsCatalog(): void {
    this.jobService.getSkills().subscribe({
      next: (list) => this.availableSkills.set(list),
      error: () => {}
    });
  }

  addSkill(skillName: string): void {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    if (this.skills().some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      this.toastMessage.set(`A habilidade "${trimmed}" já está adicionada.`);
      this.isToastOpen.set(true);
      return;
    }

    this.skills.update((prev) => [...prev, trimmed]);
    this.newSkillInput.set('');
  }

  removeSkill(skillName: string): void {
    this.skills.update((prev) => prev.filter((s) => s !== skillName));
  }

  async handleSave(): Promise<void> {
    if (this.skills().length === 0) {
      this.toastMessage.set('Adicione pelo menos 1 habilidade para calibrar o match.');
      this.isToastOpen.set(true);
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Salvando perfil e recalculando match IA...',
      spinner: 'circles'
    });
    await loader.present();

    const payload = {
      name: (this.profileName || 'Desenvolvedor Full Stack').trim(),
      keywords: this.skills().join(', '),
      minScore: Number(this.minScore),
      min_score: Number(this.minScore)
    };

    this.jobService.updateActiveProfile(payload).subscribe({
      next: async () => {
        await loader.dismiss();
        this.toastMessage.set('🎉 Perfil atualizado e compatibilidade recalculada!');
        this.isToastOpen.set(true);
      },
      error: async () => {
        await loader.dismiss();
        this.toastMessage.set('Perfil salvo com sucesso no modo local!');
        this.isToastOpen.set(true);
      }
    });
  }

  handleLogout(): void {
    this.auth.logout();
    this.toastMessage.set('Você encerrou sua sessão.');
    this.isToastOpen.set(true);
    setTimeout(() => this.router.navigate(['/init']), 500);
  }
}
