import { Component, OnInit } from '@angular/core';
import { CandidatesService, Candidate } from '../../services/candidates.service';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  loading = false;
  errorMsg: string | null = null;

  editForm: FormGroup | null = null;
  editingId: string | null = null;

  constructor(private candidatesService: CandidatesService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading = true;
    this.candidatesService.getCandidates().subscribe({
      next: data => {
        console.log('candidates loaded:', data);
        this.candidates = data;
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err;
        this.loading = false;
      }
    });
  }

  startEdit(candidate: Candidate) {
    this.editingId = candidate.id || null;
    this.editForm = this.fb.group({
      name: new FormControl(candidate.name),
      surname: new FormControl(candidate.surname),
      seniority: new FormControl(candidate.seniority),
      years: new FormControl(candidate.years),
      availability: new FormControl(candidate.availability)
    });
  }

  saveEdit() {
    if (!this.editForm || this.editingId === null) return;

    const update = this.editForm.value;
    this.candidatesService.updateCandidate(this.editingId, update).subscribe({
      next: () => {
        this.loadCandidates();
        this.editingId = null;
        this.editForm = null;
      },
      error: err => this.errorMsg = err
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editForm = null;
  }

  deleteCandidate(id?: string) {
    if (!id) {
      console.error('deleteCandidate: id is missing', id);
      this.errorMsg = 'No se puede eliminar: id del candidato ausente';
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este candidato?')) return;

    this.candidatesService.deleteCandidate(id).subscribe({
      next: () => this.loadCandidates(),
      error: err => this.errorMsg = err
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.editForm!.get(controlName) as FormControl;
  }
}
