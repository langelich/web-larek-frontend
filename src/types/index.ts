export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface ICustomerData {
	email?: string
	address?: string
	phone?: string
	payment?: string
}

export type TProductBase = Pick<IProductItem, 'id' | 'title' | 'price'>

export interface IBasket {
	items: TProductBase[];
	isContain(productId: string): boolean;
	add(product: TProductBase): void;
	delete(productId: string): void;
	clear(): void;
	isContain(productId: string): void;
}

export interface ICatalog {
	items: IProductItem[];
	preview: string | null;
	getItem(productId: string): IProductItem;
}

export type TOrder = ICustomerData & {
	items?: string[];
	total?: number;
}

export type TOrderResponse = Pick<TOrder, 'total'> & {
	id?: string;
}
