import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonSpinner,
  IonToast,
  IonRefresher,
  IonRefresherContent,
  LoadingController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  heart,
  heartOutline,
  locationOutline,
  calendarOutline,
  sparklesOutline,
  briefcaseOutline,
  chevronForwardOutline,
  refreshOutline,
  filterOutline,
  starOutline,
  star
} from 'ionicons/icons';
import { JobApiService } from '../../core/services/job-api.service';
import { FavoritesStorageService } from '../../core/services/favorites-storage.service';
import { AuthService } from '../../core/services/auth.service';
import { UserJobMatchResponse, Skill, MatchStatus } from '../../core/models/job.model';
import { MatchScorePipe } from '../../shared/pipes/match-score.pipe';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { MatchHighlightDirective } from '../../shared/directives/match-highlight.directive';
import { CardHoverDirective } from '../../shared/directives/card-hover.directive';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DatePipe,
    TitleCasePipe,
    MatchScorePipe,
    TruncatePipe,
    MatchHighlightDirective,
    CardHoverDirective,
    IonHeader,
    IonToolbar,
    IonContent,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel,
    IonSpinner,
    IonToast,
    IonRefresher,
    IonRefresherContent
  ]
})
export class JobsPage implements OnInit {
  private jobService = inject(JobApiService);
  public favService = inject(FavoritesStorageService);
  public auth = inject(AuthService);
  private loadingCtrl = inject(LoadingController);

  readonly stages: { value: MatchStatus; label: string }[] = [
    { value: 'new', label: 'Nova' },
    { value: 'applied', label: 'Enviada' },
    { value: 'interview', label: 'Entrevista' },
    { value: 'discarded', label: 'Descartada' }
  ];

  // Estado reativo com Signals
  matches = signal<UserJobMatchResponse[]>([]);
  skills = signal<Skill[]>([]);
  loading = signal<boolean>(true);
  isRefreshing = signal<boolean>(false);

  // Filtros reativos espelhados da Home.tsx
  searchTerm = signal<string>('');
  minScore = signal<number>(0);
  onlyFavorites = signal<boolean>(false);
  selectedSkill = signal<string>('all');

  toastMessage = signal<string>('');
  isToastOpen = signal<boolean>(false);

  // Lista computada instantânea no cliente
  filteredMatches = computed(() => {
    let list = this.matches();
    const query = this.searchTerm().trim().toLowerCase();
    const scoreThreshold = this.minScore();
    const favOnly = this.onlyFavorites();
    const skill = this.selectedSkill();

    if (query) {
      list = list.filter(
        (m) =>
          m.job.title.toLowerCase().includes(query) ||
          m.job.company.toLowerCase().includes(query) ||
          m.job.description.toLowerCase().includes(query)
      );
    }

    if (scoreThreshold > 0) {
      list = list.filter((m) => m.score >= scoreThreshold);
    }

    if (favOnly) {
      list = list.filter((m) => m.is_favorite || this.favService.isFavorite(m.id));
    }

    if (skill !== 'all') {
      const sLower = skill.toLowerCase();
      list = list.filter(
        (m) =>
          m.job.title.toLowerCase().includes(sLower) ||
          m.job.description.toLowerCase().includes(sLower)
      );
    }

    return list;
  });

  constructor() {
    addIcons({
      searchOutline,
      heart,
      heartOutline,
      locationOutline,
      calendarOutline,
      sparklesOutline,
      briefcaseOutline,
      chevronForwardOutline,
      refreshOutline,
      filterOutline,
      starOutline,
      star
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.loadSkills();
  }

  ionViewWillEnter(): void {
    if (this.matches().length > 0) {
      this.loadJobs(undefined, true);
    }
  }

  private showToast(msg: string): void {
    this.isToastOpen.set(false);
    setTimeout(() => {
      this.toastMessage.set(msg);
      this.isToastOpen.set(true);
    }, 10);
  }

  getStageLabel(status: string): string {
    const found = this.stages.find((s) => s.value === status);
    return found ? found.label : 'Nova';
  }

  loadJobs(event?: any, silent = false): void {
    if (!silent) {
      this.loading.set(true);
    }
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.matches.set(data);
        this.loading.set(false);
        if (event) event.target.complete();
      },
      error: () => {
        this.loading.set(false);
        if (event) event.target.complete();
      }
    });
  }

  loadSkills(): void {
    this.jobService.getSkills().subscribe({
      next: (data) => this.skills.set(data.slice(0, 10)),
      error: () => {}
    });
  }

  async handleManualRefresh(): Promise<void> {
    this.isRefreshing.set(true);
    const loader = await this.loadingCtrl.create({
      message: 'Executando Scraper Gupy & Cálculo de Aderência IA...',
      spinner: 'circles',
      duration: 35000
    });
    await loader.present();

    this.jobService.refreshJobs().subscribe({
      next: async (res) => {
        try { await loader.dismiss(); } catch {}
        this.isRefreshing.set(false);
        const msg = res?.message || '✨ Vagas sincronizadas com sucesso a partir da API da Gupy!';
        this.showToast(msg);
        this.loadJobs();
      },
      error: async (err) => {
        try { await loader.dismiss(); } catch {}
        this.isRefreshing.set(false);
        const errorMsg = err?.error?.message || 'Aviso: Back-end offline ou limite de tempo. Vagas atuais mantidas.';
        this.showToast(errorMsg);
        this.loadJobs();
      }
    });
  }

  toggleSkill(skillName: string): void {
    this.selectedSkill.set(this.selectedSkill() === skillName ? 'all' : skillName);
  }

  handleStatusChange(event: Event, matchId: number, newStatus: MatchStatus): void {
    event.stopPropagation();
    event.preventDefault();

    const current = this.matches().find((m) => m.id === matchId);
    if (current?.status === newStatus) return;

    // Atualização otimista imediata + persistência na API (PATCH)
    this.matches.update((prev) => prev.map((m) => (m.id === matchId ? { ...m, status: newStatus } : m)));

    this.jobService.updateMatch(matchId, { status: newStatus }).subscribe({
      next: () => {
        this.showToast(`✓ Etapa alterada para "${this.getStageLabel(newStatus)}"`);
      },
      error: () => {
        this.showToast('Não foi possível salvar a etapa no servidor.');
      }
    });
  }

  toggleFavorite(event: Event, matchId: number): void {
    event.stopPropagation();
    event.preventDefault();
    const isFav = this.favService.toggleFavorite(matchId);
    this.matches.update((prev) => prev.map((m) => (m.id === matchId ? { ...m, is_favorite: isFav } : m)));
    this.jobService.updateMatch(matchId, { is_favorite: isFav }).subscribe({ error: () => {} });
    this.showToast(isFav ? '⭐ Vaga salva nos favoritos!' : 'Vaga removida dos favoritos.');
  }
}
