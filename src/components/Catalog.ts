import { ICatalog, IProductItem } from '../types';
import { IEvents } from './base/events'

export class Catalog implements ICatalog {
	protected _items: IProductItem[];
	protected _preview: string | null;
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
    }

    get items () {
        return this._items;
    }

    set items (items: IProductItem[]) {
        this._items = items;
        this.events.emit('catalog:added', items);
    }

    set preview (productId: string | null) {
        if (!productId) {
            this._preview = null;
        }
        const itemSelected = this.getItem(productId);
        if (itemSelected) {
            this._preview = productId;
            this.events.emit('catalog:selected', this.getItem(productId));
        }
    }

	getItem (productId: string) {
        return this._items.find(item => item['id'] === productId);
    }
}
