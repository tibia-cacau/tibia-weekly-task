import {
	Component,
	ElementRef,
	HostListener,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Item, PageResponse } from '../../models/item.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { ItemService } from '../../services/item.service';

@Component({
	selector: 'app-item-list',
	templateUrl: './item-list.component.html',
	styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
	@ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

	items: Item[] = [];
	searchControl = new FormControl('');
	loading = false;
	loadingMore = false;
	displayedColumns: string[] = [
		'image',
		'name',
		'droppedBy',
		'sellTo',
		'price',
	];

	// Infinite scroll properties
	totalElements = 0;
	pageSize = 30;
	pageIndex = 0;
	hasMore = true;

	constructor(private itemService: ItemService) {}

	ngOnInit(): void {
		this.loadItems();
		this.setupSearch();
	}

	loadItems(append: boolean = false): void {
		if (append) {
			this.loadingMore = true;
		} else {
			this.loading = true;
		}

		const searchTerm = this.searchControl.value || '';

		const request = searchTerm
			? this.itemService.searchItemByName(
					searchTerm,
					this.pageIndex,
					this.pageSize
			  )
			: this.itemService.getAllItems(this.pageIndex, this.pageSize);

		request.subscribe({
			next: (response: PageResponse<Item>) => {
				if (append) {
					this.items = [...this.items, ...response.content];
				} else {
					this.items = response.content;
				}
				this.totalElements = response.totalElements;
				this.hasMore = this.items.length < this.totalElements;
				this.loading = false;
				this.loadingMore = false;
			},
			error: (error) => {
				console.error('Error loading items:', error);
				this.loading = false;
				this.loadingMore = false;
			},
		});
	}

	setupSearch(): void {
		this.searchControl.valueChanges
			.pipe(debounceTime(300), distinctUntilChanged())
			.subscribe(() => {
				this.pageIndex = 0;
				this.items = [];
				this.hasMore = true;
				this.loadItems();
			});
	}

	@HostListener('window:scroll', ['$event'])
	onScroll(): void {
		const scrollPosition = window.innerHeight + window.scrollY;
		const scrollHeight = document.documentElement.scrollHeight;
		const threshold = 800; // Carregar quando estiver a 800px do final

		if (
			scrollPosition >= scrollHeight - threshold &&
			!this.loading &&
			!this.loadingMore &&
			this.hasMore
		) {
			this.pageIndex++;
			this.loadItems(true);
		}
	}

	getImageUrl(item: Item): string {
		return item.id ? this.itemService.getItemImage(item.id) : '';
	}

	getCreatureWikiUrl(creatureName: string): string {
		// Replace spaces with underscores for the wiki URL
		const formattedName = creatureName.replace(/ /g, '_');
		return `https://www.tibiawiki.com.br/wiki/${formattedName}`;
	}

	getDroppedByText(droppedBy: string[]): string {
		return droppedBy.join(', ');
	}

	onImageError(event: Event): void {
		const imgElement = event.target as HTMLImageElement;
		imgElement.src = 'assets/images/no-image.png';
	}

	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent): void {
		// Captura Ctrl+F (Windows/Linux) ou Cmd+F (Mac)
		if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
			event.preventDefault();
			if (this.searchInput) {
				this.searchInput.nativeElement.focus();
			}
		}
	}
}
