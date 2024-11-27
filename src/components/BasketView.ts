import { TProductBase } from "../types";
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
            this.events.emit(`basketView:order`);
        })
    }

    set cardsList(cards: HTMLElement[]) {
        if (cards.length > 0) {
            this._cardsList.replaceChildren(...cards);

            cards.forEach((card, i) => {
                const li = card.querySelector('.basket__item-index')
                li.textContent = `${i + 1}`;
            })
        }
    }

    getCardsList() {
        return this._cardsList;
    }

    removeBasket() {
        this._cardsList.childNodes.forEach(item => item.remove());
    }

    set total(value: number) {
        this._total.textContent = `${value} синапсов`;
        this.setActive(value);
    }

    setActive(value: number) {
        (value > 0) ? this.setValid(true) : this.setValid(false);
    }

    render(): HTMLElement {
        return this._contentElement;
    }
}
