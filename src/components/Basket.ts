import { IBasket, TOrder, TProductBase } from '../types';
import { IEvents } from './base/events'

export class Basket implements IBasket {
	  protected _items: TProductBase[];
    protected events: IEvents;
    protected _order: Partial<TOrder>;

    constructor (events: IEvents) {
        this._items = [];
        this.events = events;
        this._order = {};
    };

    get items () {
        return this._items;
    }

    set items (items: TProductBase[]) {
        this._items = items;
    }

    get total () {
        const prices = this._items.map(item => item.price);
        const sum = prices.reduce((prevPrice, currentPrice) => prevPrice + currentPrice, 0);
        return sum;
    }

    set order (value: Partial<TOrder>) {
        this._order.email = value.email;
        this._order.address = value.address;
        this._order.phone = value.phone;
        this._order.payment = value.payment;
        this._order.items = value.items;
        this._order.total = value.total;
    }

    get order() {
        return this._order
    }

    isContain(productId: string) {
        const itemChecked = this._items.find(item => item['id'] === productId);
        return (this._items.includes(itemChecked));
    }

	  add (product: TProductBase) {
        this._items.push(product);
        this.events.emit('basket:change', this.items);
    }

	  delete (productId: string) {
        const deleteItem = this._items.find(item => item['id'] === productId);
        const indexDeleteItem = this._items.indexOf(deleteItem);
        this._items.splice(indexDeleteItem, 1);
        this.events.emit('basket:change', this.items);
    }

	  clear () {
        this._items.splice(0, this._items.length);
        this.events.emit('basket:change');
    }
}
