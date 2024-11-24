import { IProductItem, TProductBase } from "../types"
import { cloneTemplate } from "../utils/utils"
import { IEvents } from "./base/events"

export class Card {
    protected _contentElement: HTMLElement;
    protected title: HTMLTitleElement;
    protected price: HTMLElement;
    protected category?: HTMLElement;
    protected description?: HTMLElement;
    protected _button: HTMLButtonElement;
    protected image?: HTMLImageElement;
    protected events: IEvents;
    protected cardId: string;

    constructor(selector: string, events: IEvents) {
        this._contentElement = cloneTemplate(selector);
        
        this.title = this._contentElement.querySelector('.card__title');
        this.price = this._contentElement.querySelector('.card__price');
        this.category = this._contentElement.querySelector('.card__category');
        this.description = this._contentElement.querySelector('.card__text');
        this.image = this._contentElement.querySelector('.card__image');
        this._button = this._contentElement.querySelector('.card__button');

        this.events = events;
    }

    get id () {
        return this.cardId;
    }

    get contentElement() {
        return this._contentElement;
    }

    get button() {
        return this._button;
    }

    set categoryColor(color: string) {
        this.category.classList.add(`card__category${color}`);
    }

    setData(cardData: Partial<IProductItem>) {
        this.cardId = cardData.id;

        this.title.textContent = cardData.title;
        this.category ? this.category.textContent = cardData.category : null;
        this.description ? this.description.textContent = cardData.description : null;
        this.image ? this.image.src = cardData.image : null;
        this.image ? this.image.alt = cardData.title : null;

        if (this.category) {
            if (cardData.category === 'софт-скил') this.categoryColor = '_soft';
            if (cardData.category === 'другое') this.categoryColor = '_other';
            if (cardData.category === 'дополнительное') this.categoryColor = '_additional';
            if (cardData.category === 'кнопка') this.categoryColor = '_button';
            if (cardData.category === 'хард-скил') this.categoryColor = '_hard';
        }
        
        (cardData.price === null) ? this.price.textContent = 'Бесценно' : this.price.textContent = `${cardData.price} синапсов`;
    }
}

export class CardCatalog extends Card {
    constructor(selector: string, events: IEvents) {
        super(selector, events)

        this._contentElement.addEventListener('click', () => {
            this.events.emit(`card:open`, {id: this.id} );
        });
    }
}

export class CardPreview extends Card {
    constructor(selector: string, events: IEvents) {
        super(selector, events)

        this._button.addEventListener('click', () => {
            this.events.emit(`card:change`, this);
            if (this._button.textContent === 'Удалить из корзины') {
                this._button.textContent = 'В корзину';
            } else {
                this._button.textContent = 'Удалить из корзины';
            };
        })
    }
}

export class CardBasket extends Card {
    protected _quantity: HTMLElement;

    constructor(selector: string, events: IEvents) {
        super(selector, events)

        this._quantity = this._contentElement.querySelector('.basket__item-index');

        this._button.addEventListener('click', () => {
            this._contentElement.remove();
            this.events.emit(`card:delete`, {id: this.id});
        });
    }

    set quantity(value: number) {
        this._quantity.textContent = `${value}`;
    }
}