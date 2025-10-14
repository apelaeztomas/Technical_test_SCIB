import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadCandidateComponent } from './components/upload-candidate/upload-candidate.component';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  { path: 'upload', component: UploadCandidateComponent },
  { path: 'list', component: CandidateListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
