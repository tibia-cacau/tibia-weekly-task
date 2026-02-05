import {
	SessionAnalyserResponse,
	WeeklyTask,
} from '../../models/weekly-task.model';
import {
	SessionData,
	SessionParserComponent,
} from '../../../../../../shared-components/session-parser/session-parser.component';

import { Component } from '@angular/core';
import { SessionAnalyserService } from '../../services/session-Analyser.service';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-session-Analyser',
	templateUrl: './session-Analyser.component.html',
	styleUrls: ['./session-Analyser.component.scss'],
})
export class SessionAnalyserComponent {
	errorMessage: string = '';
	analysisResult: SessionAnalyserResponse | null = null;
	isAnalyzing: boolean = false;
	apiBaseUrl = environment.apiBaseUrl;

	constructor(private sessionAnalyserService: SessionAnalyserService) {}

	onSessionParsed(sessionData: SessionData): void {
		this.errorMessage = '';
		this.analysisResult = null;

		const hasMonsters = sessionData.killedMonsters.length > 0;
		const hasItems = sessionData.lootedItems.length > 0;

		if (!hasMonsters && !hasItems) {
			this.errorMessage =
				'Nenhum monstro ou item encontrado no texto da sessão.';
			return;
		}

		this.isAnalyzing = true;
		const monsterNames = sessionData.killedMonsters.map((km) => km.name);
		const lootedItems = sessionData.lootedItems.map((item) => item.name);

		// Uma única chamada ao backend com monstros E itens
		this.sessionAnalyserService
			.analyzeSession({ monsterNames, lootedItems })
			.subscribe({
				next: (response) => {
					this.analysisResult = response;
					this.isAnalyzing = false;
				},
				error: (err) => {
					this.errorMessage =
						'Erro ao analisar sessão. Por favor, tente novamente.';
					console.error('Analysis error:', err);
					this.isAnalyzing = false;
				},
			});
	}

	onSessionCleared(): void {
		this.analysisResult = null;
		this.errorMessage = '';
	}

	getDifficultyStars(difficulty: number): string {
		return '⭐'.repeat(difficulty);
	}

	getTaskTypeIcon(taskType: string): string {
		return taskType === 'ITEM_DELIVERY' ? '📦' : '⚔️';
	}

	getTaskTypeName(taskType: string): string {
		return taskType === 'ITEM_DELIVERY' ? 'Item Delivery' : 'Monster Kill';
	}

	trackByTaskId(index: number, task: WeeklyTask): number {
		return task.id;
	}
}
