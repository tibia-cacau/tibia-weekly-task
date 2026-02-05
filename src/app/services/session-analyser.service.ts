import {
	SessionAnalyserRequest,
	SessionAnalyserResponse,
} from '../models/weekly-task.model';

import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SessionAnalyserService {
	private apiUrl: string;

	constructor(
		private http: HttpClient,
		private config: ConfigService,
	) {
		this.apiUrl = `${this.config.getApiUrl()}/tasks`;
	}

	analyzeSession(
		request: SessionAnalyserRequest,
	): Observable<SessionAnalyserResponse> {
		return this.http.post<SessionAnalyserResponse>(
			`${this.apiUrl}/analyze-session`,
			request,
		);
	}
}
