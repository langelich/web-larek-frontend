export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IProductList {
	total: number;
	items: IProductItem[];
}

export interface ICustomerData {
	email: string
	address: string
	phone: string
	payment: string
}

export interface ICustomer {
	customerData: ICustomerData;
	checkValidation(data: Record<keyof TCustomerInfo, string>): boolean;
}

export type TProductBase = Pick<IProductItem, 'id' | 'title' | 'price'>

export type TCustomerInfo = Pick<ICustomerData, 'phone' | 'email' | 'address'>

export type TBasketTotal = Pick<IBasket, 'total'>

export type TBasketCounter = Pick<IBasket, 'counter'>

export interface IBasket {
	items: TProductBase[];
	counter: number;
	total: number;
	add(product: TProductBase): void;
	delete(productId: string): void;
	clear(): void;
}

export interface ICatalog {
	items: IProductItem[];
	preview: string | null;
	getItem(productId: string): IProductItem;
}
