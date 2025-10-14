import { Component, OnInit } from '@angular/core';
import { CandidatesService, Candidate } from '../../services/candidates.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  loading = false;
  errorMsg: string | null = null;

  constructor(private candidatesService: CandidatesService) {}

  ngOnInit() {
    this.loading = true;
    this.candidatesService.getCandidates().subscribe({
      next: (data) => {
        this.candidates = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err;
        this.loading = false;
      }
    });
  }
}
