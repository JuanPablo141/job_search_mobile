import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserJobMatchResponse, Skill, JobFilter, SearchProfile } from '../models/job.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobApiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  private mockProfile: SearchProfile = {
    id: 1,
    name: 'Desenvolvedor Front-End / Full-Stack',
    keywords: 'React, TypeScript, Java, Spring Boot, Angular, Ionic, CSS, Git, REST',
    min_score: 70
  };

  private mockJobs: UserJobMatchResponse[] = [
    {
      id: 1,
      job_id: 101,
      score: 95.0,
      is_favorite: true,
      status: 'applied',
      matched_at: new Date().toISOString(),
      job: {
        id: 101,
        title: 'Desenvolvedor Front-End Angular / Mobile',
        company: 'Tech Solutions Brasil',
        location: 'Remoto (Brasil)',
        url: 'https://portal.gupy.io',
        description: 'Vaga para atuar no desenvolvimento de aplicações mobile de alta performance utilizando Angular 18+, Ionic Framework, TypeScript, RxJS e consumo de APIs REST.',
        posted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        source: 'Gupy'
      }
    },
    {
      id: 2,
      job_id: 102,
      score: 88.5,
      is_favorite: false,
      status: 'interview',
      matched_at: new Date().toISOString(),
      job: {
        id: 102,
        title: 'Engenheiro de Software Fullstack (Java & Angular)',
        company: 'Fintech Inovação',
        location: 'São Paulo - SP (Híbrido)',
        url: 'https://portal.gupy.io',
        description: 'Buscamos profissional com sólida experiência em microsserviços Spring Boot 3+, banco de dados relacional e interfaces modernas com Angular Standalone.',
        posted_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        source: 'Gupy'
      }
    },
    {
      id: 3,
      job_id: 103,
      score: 82.0,
      is_favorite: true,
      status: 'new',
      matched_at: new Date().toISOString(),
      job: {
        id: 103,
        title: 'Desenvolvedor Mobile Cross-Platform (Ionic)',
        company: 'Vanguard Digital Labs',
        location: 'Recife - PE (Remoto)',
        url: 'https://portal.gupy.io',
        description: 'Desenvolvimento de recursos mobile para iOS e Android com Capacitor e Ionic. Conhecimento em diretivas customizadas, pipes e componentização limpa.',
        posted_at: new Date(Date.now() - 86400000 * 6).toISOString(),
        source: 'Gupy'
      }
    },
    {
      id: 4,
      job_id: 104,
      score: 68.0,
      is_favorite: false,
      status: 'new',
      matched_at: new Date().toISOString(),
      job: {
        id: 104,
        title: 'Analista de Sistemas / Desenvolvedor Java Jr',
        company: 'Global Core Consulting',
        location: 'Curitiba - PR (Presencial)',
        url: 'https://portal.gupy.io',
        description: 'Oportunidade para início na carreira em engenharia de software com Java, Spring Data JPA, Hibernate e automação de rotinas em Python.',
        posted_at: new Date(Date.now() - 86400000 * 8).toISOString(),
        source: 'Gupy'
      }
    },
    {
      id: 5,
      job_id: 105,
      score: 55.0,
      is_favorite: false,
      status: 'discarded',
      matched_at: new Date().toISOString(),
      job: {
        id: 105,
        title: 'Desenvolvedor Python Backend & IA',
        company: 'Neural Data AI',
        location: 'Belo Horizonte - MG (Remoto)',
        url: 'https://portal.gupy.io',
        description: 'Construção de pipelines de extração de dados (crawlers/scrapers), modelos de aderência semântica e integração com APIs REST corporativas.',
        posted_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        source: 'Gupy'
      }
    }
  ];

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.token();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Método GET 1: Lista todas as vagas e matches
   */
  getJobs(filters?: JobFilter): Observable<UserJobMatchResponse[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.is_favorite !== undefined) params = params.set('is_favorite', filters.is_favorite);
    if (filters?.min_score) params = params.set('min_score', filters.min_score);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<UserJobMatchResponse[]>(`${this.apiUrl}/jobs`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError((error) => {
        console.warn('Backend offline. Usando dados mockados:', error);
        let list = [...this.mockJobs];
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          list = list.filter((m) => m.job.title.toLowerCase().includes(q) || m.job.company.toLowerCase().includes(q));
        }
        if (filters?.min_score) {
          list = list.filter((m) => m.score >= filters.min_score!);
        }
        if (filters?.is_favorite) {
          list = list.filter((m) => m.is_favorite);
        }
        return of(list);
      })
    );
  }

  /**
   * Método GET 2: Detalhes de uma vaga por ID (Ponto Extra da rota)
   */
  getJobById(id: number): Observable<UserJobMatchResponse> {
    return this.http.get<UserJobMatchResponse>(`${this.apiUrl}/jobs/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        console.warn(`Vaga ${id} no mock:`, error);
        const found = this.mockJobs.find((m) => m.id === Number(id) || m.job.id === Number(id));
        return of(found || this.mockJobs[0]);
      })
    );
  }

  /**
   * Método GET 3: Catálogo público de competências técnicas (Skills)
   */
  getSkills(search?: string): Observable<Skill[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);

    return this.http.get<Skill[]>(`${this.apiUrl}/skills`, { params }).pipe(
      catchError(() => {
        const fallbackSkills: Skill[] = [
          { name: 'Angular', category: 'Front-end' },
          { name: 'Ionic', category: 'Mobile' },
          { name: 'TypeScript', category: 'Linguagem' },
          { name: 'React', category: 'Front-end' },
          { name: 'Java', category: 'Linguagem' },
          { name: 'Spring Boot', category: 'Back-end' },
          { name: 'Python', category: 'Linguagem' },
          { name: 'Docker', category: 'DevOps & Cloud' },
          { name: 'SQL', category: 'Banco de Dados' },
          { name: 'PostgreSQL', category: 'Banco de Dados' },
          { name: 'AWS', category: 'DevOps & Cloud' },
          { name: 'Git', category: 'DevOps & Cloud' },
          { name: 'REST API', category: 'Back-end' }
        ];
        return of(fallbackSkills);
      })
    );
  }

  /**
   * Atualização de status ou favorito da vaga (PATCH)
   */
  updateMatch(id: number, update: { status?: string; is_favorite?: boolean }): Observable<UserJobMatchResponse> {
    return this.http.patch<UserJobMatchResponse>(`${this.apiUrl}/jobs/${id}`, update, {
      headers: this.getHeaders()
    }).pipe(
      catchError(() => {
        const item = this.mockJobs.find((m) => m.id === Number(id));
        if (item) {
          if (update.status) item.status = update.status as any;
          if (update.is_favorite !== undefined) item.is_favorite = update.is_favorite;
          return of(item);
        }
        return of(this.mockJobs[0]);
      })
    );
  }

  /**
   * Método GET 4: Perfil de busca ativo do usuário
   */
  getActiveProfile(): Observable<SearchProfile> {
    return this.http.get<SearchProfile>(`${this.apiUrl}/profiles/active`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(() => of(this.mockProfile))
    );
  }

  /**
   * Atualização do perfil ativo de busca (PUT)
   */
  updateActiveProfile(profile: Partial<SearchProfile>): Observable<SearchProfile> {
    return this.http.put<SearchProfile>(`${this.apiUrl}/profiles/active`, profile, {
      headers: this.getHeaders()
    }).pipe(
      catchError(() => {
        this.mockProfile = { ...this.mockProfile, ...profile };
        return of(this.mockProfile);
      })
    );
  }

  /**
   * Disparo manual do Crawler Gupy & NLP Matching (POST)
   */
  refreshJobs(): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs/refresh`, {}, {
      headers: this.getHeaders()
    });
  }
}
