import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Candidate {
  id?: string;
  name: string;
  surname: string;
  seniority: 'junior' | 'senior';
  years: number;
  availability: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {
  private apiUrl = 'http://localhost:3000/candidates';

  constructor(private http: HttpClient) {}

  uploadCandidate(file: File, name: string, surname: string): Observable<Candidate> {
    const formData = new FormData();
    formData.append('excel', file);
    formData.append('name', name);
    formData.append('surname', surname);

    return this.http.post<Candidate>(`${this.apiUrl}/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  updateCandidate(id: string, update: Partial<Candidate>): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/${id}`, update);
  }

  deleteCandidate(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Error desconocido';
    if (error.error?.message) msg = error.error.message;
    return throwError(() => msg);
  }
}
