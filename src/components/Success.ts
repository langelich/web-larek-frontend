import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";

export class Success {
    protected _contentElement: HTMLElement;
    protected _total: HTMLElement;
    protected button: HTMLButtonElement;
    protected events: IEvents;

    constructor(selector: string, events: IEvents) {
        this._contentElement = cloneTemplate(selector);
        
        this._total = this._contentElement.querySelector('.order-success__description');
        this.button = this._contentElement.querySelector('.order-success__close');
        this.events = events;

        this.button.addEventListener('click', () => {
            this.events.emit('success:close');
        })
    }

    set total (value: number) {
        this._total.textContent = `Списано ${value} синапсов`;
    }

    get contentElement() {
        return this._contentElement;
    }
}
