import { Component, OnInit } from '@angular/core';
import { CandidatesService, Candidate } from '../../services/candidates.service';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  loading = false;
  errorMsg: string | null = null;
  editForm: FormGroup | null = null;
  editingId: string | null = null;
  filterText = '';
  filteredCandidates: Candidate[] = [];
  pageSize = 5;
  currentPage = 1;
  paginatedCandidates: Candidate[] = [];
  totalPages = 1;

  constructor(private candidatesService: CandidatesService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadCandidates();
    this.filteredCandidates = [...this.candidates];
    this.updatePagination();
  }

  loadCandidates() {
    this.loading = true;
    this.candidatesService.getCandidates().subscribe({
      next: data => {
        this.candidates = data;
        this.filteredCandidates = [...this.candidates];
        this.updatePagination();
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err;
        this.loading = false;
      }
    });
  }

  applyFilter() {
    const filter = this.filterText.toLowerCase();
    this.filteredCandidates = this.candidates.filter(c =>
      c.name.toLowerCase().includes(filter) ||
      c.surname.toLowerCase().includes(filter) ||
      c.seniority.toLowerCase().includes(filter) ||
      c.years.toString().includes(filter) ||
      (c.availability ? 'sí' : 'no').includes(filter)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCandidates.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCandidates = this.filteredCandidates.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
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
    // Hago esto para que no se quede en la página si borro el ultimo usuario de una pagina
    this.candidatesService.deleteCandidate(id).subscribe({
      next: () => {
        this.candidates = this.candidates.filter(c => c.id !== id);
        this.filteredCandidates = this.filteredCandidates.filter(c => c.id !== id);
        this.totalPages = Math.max(1, Math.ceil(this.filteredCandidates.length / this.pageSize));
        if (this.filteredCandidates.length === 0) {
          this.currentPage = 1;
          this.paginatedCandidates = [];
          return;
        }
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
        this.updatePagination();
      },
      error: err => {
        console.error('Error borrando candidato', err);
        this.errorMsg = err?.error?.message || err?.message || 'Error al eliminar';
      }
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.editForm!.get(controlName) as FormControl;
  }
}
