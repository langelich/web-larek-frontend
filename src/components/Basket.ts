import { IBasket, TProductBase } from '../types';
import { IEvents } from './base/events'

export class Basket implements IBasket {
	protected _items: TProductBase[];
    protected events: IEvents;

    constructor (events: IEvents) {
        this._items = [];
        this.events = events;
    }

    get items () {
        return this._items;
    }

    set items (items: TProductBase[]) {
        this._items = items;
    }

    get total () {
        let sum = 0;
        this._items.forEach( item => { 
            sum = sum + item.price;
        });
        return sum;
    }

    isContain(productId: string) {
        let itemChecked = this._items.find(item => item['id'] === productId);
        return (this._items.includes(itemChecked))
    }

	add (product: TProductBase) {
        this._items.push(product);
        this.events.emit('basket:add', product);
    }

	delete (productId: string) {
        let deleteItem = this._items.find(item => item['id'] === productId);
        let indexDeleteItem = this._items.indexOf(deleteItem);
        this._items.splice(indexDeleteItem, 1);
        
        this.events.emit('basket:delete', {id: productId});
    }

	clear () {
        this._items.splice(0, this._items.length);
    }
}
