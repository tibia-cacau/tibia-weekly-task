export interface Item {
  id?: string;
  name: string;
  imageUrl?: string;
  droppedBy: string[];
  sellTo: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemResponse {
  id: string;
  name: string;
  imageUrl: string;
  droppedBy: string[];
  sellToNpc: string;
  priceAtNpc: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
