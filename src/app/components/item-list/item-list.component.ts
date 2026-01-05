import {
	Component,
	ElementRef,
	HostListener,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Item, PageResponse } from '../../models/item.model';
import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { ItemService } from '../../services/item.service';

@Component({
	selector: 'app-item-list',
	templateUrl: './item-list.component.html',
	styleUrls: ['./item-list.component.scss'],
	animations: [
		trigger('expandCollapse', [
			state(
				'expanded',
				style({
					height: '*',
					opacity: 1,
				})
			),
			state(
				'collapsed',
				style({
					height: '0',
					opacity: 0,
				})
			),
			transition('expanded <=> collapsed', [
				animate('300ms ease-in-out'),
			]),
		]),
	],
})
export class ItemListComponent implements OnInit {
	@ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

	items: Item[] = [];
	searchControl = new FormControl('');
	filterYasir = false;
	loading = false;
	loadingMore = false;
	displayedColumns: string[] = [
		'select',
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

	// Selected items properties
	selectedItems: Item[] = [];
	isSelectedItemsExpanded = true;
	private readonly MAX_SELECTED_ITEMS = 9;
	private readonly STORAGE_KEY = 'weekly-tasks-selected-items';

	constructor(private itemService: ItemService) {}

	ngOnInit(): void {
		this.loadSelectedItemsFromStorage();
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
					this.pageSize,
					this.filterYasir
			  )
			: this.itemService.getAllItems(
					this.pageIndex,
					this.pageSize,
					'name',
					'ASC',
					this.filterYasir
			  );

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

	onYasirFilterChange(): void {
		this.pageIndex = 0;
		this.items = [];
		this.hasMore = true;
		this.loadItems();
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

	// Selected items methods
	toggleSelectedItems(): void {
		this.isSelectedItemsExpanded = !this.isSelectedItemsExpanded;
	}

	isItemSelected(item: Item): boolean {
		return this.selectedItems.some((selected) => selected.id === item.id);
	}

	canSelectMore(): boolean {
		return this.selectedItems.length < this.MAX_SELECTED_ITEMS;
	}

	toggleItemSelection(item: Item): void {
		const index = this.selectedItems.findIndex(
			(selected) => selected.id === item.id
		);

		if (index > -1) {
			// Remove item
			this.selectedItems.splice(index, 1);
		} else if (this.canSelectMore()) {
			// Add item
			this.selectedItems.push(item);
		}

		this.saveSelectedItemsToStorage();
	}

	removeSelectedItem(item: Item): void {
		const index = this.selectedItems.findIndex(
			(selected) => selected.id === item.id
		);
		if (index > -1) {
			this.selectedItems.splice(index, 1);
			this.saveSelectedItemsToStorage();
		}
	}

	clearAllSelected(): void {
		this.selectedItems = [];
		this.saveSelectedItemsToStorage();
	}

	private saveSelectedItemsToStorage(): void {
		try {
			localStorage.setItem(
				this.STORAGE_KEY,
				JSON.stringify(this.selectedItems)
			);
		} catch (error) {
			console.error('Error saving to localStorage:', error);
		}
	}

	private loadSelectedItemsFromStorage(): void {
		try {
			const stored = localStorage.getItem(this.STORAGE_KEY);
			if (stored) {
				this.selectedItems = JSON.parse(stored);
			}
		} catch (error) {
			console.error('Error loading from localStorage:', error);
			this.selectedItems = [];
		}
	}
}
