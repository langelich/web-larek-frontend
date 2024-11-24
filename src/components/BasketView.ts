import { cloneTemplate } from "../utils/utils"
import { ContentStepByStep } from "./base/ContentStepByStep"
import { IEvents } from "./base/events"

export class BasketView extends ContentStepByStep {
    protected _contentElement: HTMLElement;
    protected _cardsList: HTMLUListElement;
    protected modalButton: HTMLButtonElement;
    protected _total: HTMLElement;
    protected events: IEvents;

    constructor(selector: string, events: IEvents) {
        super();
        this._contentElement = cloneTemplate(selector);
        this._cardsList = this._contentElement.querySelector('.basket__list');
        this.modalButton = this._contentElement.querySelector('.basket__button');
        this._total = this._contentElement.querySelector('.basket__price');

        this.events = events;

        this.modalButton.addEventListener('click', () => {
            this.events.emit(`order:open`);
        })
    }

    get contentElement() {
        this.setActive();
        return this._contentElement;
    }

    set cardsList(cards: HTMLElement[]) {
        this._cardsList.append(...cards);  
    }

    getCardsList() {
        return this._cardsList;
    }

    removeBasket() {
        let li = this.getCardsList().querySelector('li');
        li.parentNode.removeChild(li);
    }

    set total(value: number) {
        this._total.textContent = `${value} синапсов`;
    }

    setActive() {
        (this._cardsList.childElementCount > 0) ? this.setValid(true) : this.setValid(false);
    }
}
