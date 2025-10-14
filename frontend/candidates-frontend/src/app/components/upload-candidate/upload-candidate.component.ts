import { Component, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidatesService, Candidate } from '../../services/candidates.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-candidate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-candidate.component.html',
  styleUrls: ['./upload-candidate.component.scss']
})
export class UploadCandidateComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  candidateForm: FormGroup;
  selectedFile: File | null = null;
  uploadedCandidate: Candidate | null = null;
  errorMsg: string | null = null;
  loading = false;

  constructor(private fb: FormBuilder, private candidatesService: CandidatesService) {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      excel: [null, Validators.required]
    });
  }

  onFileChange(event: any) {
    const file = event.target?.files?.[0];
    if (file) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  downloadTemplate() {
    const url = '../assets/templates/candidato_plantilla.xlsx';
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidato_plantilla.xlsx';
    a.click();
  }

  submit() {
    if (!this.selectedFile) {
      this.errorMsg = 'Selecciona un archivo Excel';
      return;
    }

    const { name, surname } = this.candidateForm.value;
    const formData = new FormData();
    formData.append('excel', this.selectedFile);
    formData.append('name', name);
    formData.append('surname', surname);

    this.loading = true;
    this.candidatesService.uploadCandidate(this.selectedFile, name, surname)
      .subscribe({
        next: (candidate) => {
          this.uploadedCandidate = candidate;
          this.errorMsg = null;
          this.loading = false;
          this.candidateForm.reset();
          if (this.fileInputRef) {
            this.fileInputRef.nativeElement.value = '';
          }
          this.selectedFile = null;
          setTimeout(() => {
            this.uploadedCandidate = null;
          }, 2000);
        },
        error: (err) => {
          this.errorMsg = err;
          this.loading = false;
        }
      });
  }
}
