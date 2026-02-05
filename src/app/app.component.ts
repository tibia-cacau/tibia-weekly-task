import { Component } from '@angular/core';
import { TabItem } from '../../../../shared-components/tibia-tabs/tibia-tabs.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	tabs: TabItem[] = [
		{ label: 'Lista de Tasks', route: './', icon: '📝', exact: true },
		{ label: 'Session Analyser', route: './session-analyser', icon: '📊' },
	];
}
