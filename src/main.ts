import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { Routes, provideRouter } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app/customer-list/customer-list.component').then(m => m.CustomerListComponent)
  },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));