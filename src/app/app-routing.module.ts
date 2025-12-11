import { RouterModule, Routes } from '@angular/router';

import { ItemListComponent } from './components/item-list/item-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: ItemListComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
