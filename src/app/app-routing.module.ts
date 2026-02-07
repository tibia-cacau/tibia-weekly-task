import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { NgModule } from '@angular/core';
import { SessionAnalyserComponent } from './components/session-analyser/session-analyser.component';

const routes: Routes = [
	{
		path: '',
		component: AppComponent,
		children: [
			{ path: '', component: ItemListComponent },
			{ path: 'session-analyser', component: SessionAnalyserComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
