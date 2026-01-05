import { HttpClient, HttpParams } from '@angular/common/http';
import { Item, ItemResponse, PageResponse } from '../models/item.model';

import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class ItemService {
	private apiUrl: string;

	constructor(
		private http: HttpClient,
		private configService: ConfigService
	) {
		this.apiUrl = this.configService.getApiUrl();
	}

	getAllItems(
		page: number = 0,
		size: number = 30,
		sortBy: string = 'name',
		sortDirection: string = 'ASC',
		filterYasir: boolean = false
	): Observable<PageResponse<Item>> {
		let params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('sortBy', sortBy)
			.set('sortDirection', sortDirection);

		if (filterYasir) {
			params = params.set('sellToNpc', 'Yasir');
		}

		return this.http
			.get<PageResponse<ItemResponse>>(`${this.apiUrl}/items`, { params })
			.pipe(
				map((response) => ({
					...response,
					content: response.content.map((item) =>
						this.mapToItem(item)
					),
				}))
			);
	}

	searchItemByName(
		name: string,
		page: number = 0,
		size: number = 30,
		filterYasir: boolean = false
	): Observable<PageResponse<Item>> {
		let params = new HttpParams()
			.set('name', name)
			.set('page', page.toString())
			.set('size', size.toString());

		if (filterYasir) {
			params = params.set('sellToNpc', 'Yasir');
		}

		return this.http
			.get<PageResponse<ItemResponse>>(`${this.apiUrl}/items/search`, {
				params,
			})
			.pipe(
				map((response) => ({
					...response,
					content: response.content.map((item) =>
						this.mapToItem(item)
					),
				}))
			);
	}

	getItemImage(id: string): string {
		return `${this.apiUrl}/items/${id}/image`;
	}

	private mapToItem(response: ItemResponse): Item {
		return {
			id: response.id,
			name: response.name,
			imageUrl: response.imageUrl,
			droppedBy: response.droppedBy,
			sellTo: response.sellToNpc,
			price: response.priceAtNpc,
		};
	}
}
