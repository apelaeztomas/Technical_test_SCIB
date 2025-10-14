import { Routes } from '@angular/router';
import { UploadCandidateComponent } from './components/upload-candidate/upload-candidate.component';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';

export const routes: Routes = [
  { path: 'upload', component: UploadCandidateComponent },
  { path: 'list', component: CandidateListComponent },
  { path: '', redirectTo: '/upload', pathMatch: 'full' },];
