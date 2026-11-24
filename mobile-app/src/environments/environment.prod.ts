export const environment = {
  production: true,
  // No Docker Compose (Nginx), '/api' faz proxy automatico para o container backend:8082.
  // Para deploy do front-end separado na nuvem (ex.: Vercel/Netlify -> Render),
  // troque abaixo pela URL publica do seu back-end (ex.: 'https://jobsearch-api.onrender.com/api').
  apiUrl: '/api',
};
