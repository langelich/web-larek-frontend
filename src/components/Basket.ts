import { IBasket, TOrder, TProductBase } from '../types';
import { IEvents } from './base/events'

export class Basket implements IBasket {
    protected _items: TProductBase[];
    protected events: IEvents;

    constructor (events: IEvents) {
        this._items = [];
        this.events = events;
    };

    get items () {
        return this._items;
    }

    set items (items: TProductBase[]) {
        this._items = items;
    }

    get total () {
        return this._items.reduce((total, currentItem) => total + currentItem.price, 0);
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
        this.events.emit('basket:change', this.items);
    }
}

