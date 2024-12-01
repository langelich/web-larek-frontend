import { IProductItem } from "../types"
import { cloneTemplate } from "../utils/utils"
import { IEvents } from "./base/events"

export class Card {
    protected _contentElement: HTMLElement;
    protected title: HTMLTitleElement;
    protected price: HTMLElement;
    protected events: IEvents;
    protected cardId: string;

    constructor(selector: string, events: IEvents) {
        this._contentElement = cloneTemplate(selector);

        this.title = this._contentElement.querySelector('.card__title');
        this.price = this._contentElement.querySelector('.card__price');

        this.events = events;
    }

    get id () {
        return this.cardId;
    }

    getContentElement(cardData: Partial<IProductItem>) {
        this.setData(cardData);
        return this._contentElement;
    }

    setData(cardData: Partial<IProductItem>) {
        this.cardId = cardData.id;
        this.title.textContent = cardData.title;
        (cardData.price === null) ? this.price.textContent = 'Бесценно' : this.price.textContent = `${cardData.price} синапсов`;
    }
}

export class CardCatalog extends Card {
    protected category: HTMLElement;
    protected image: HTMLImageElement;

    constructor(selector: string, events: IEvents) {
        super(selector, events)

        this.category = this._contentElement.querySelector('.card__category');
        this.image = this._contentElement.querySelector('.card__image');

        this._contentElement.addEventListener('click', () => {
            this.events.emit(`card:open`, {id: this.id} );
        });
    }

    set categoryColor(color: string) {
        this.category.classList.add(`card__category${color}`);
    }

    setData(cardData: Partial<IProductItem>) {
        super.setData(cardData);

        this.category.textContent = cardData.category;
        this.image.src = cardData.image;
        this.image.alt = cardData.title;

        if (cardData.category === 'софт-скил') this.categoryColor = '_soft';
        if (cardData.category === 'другое') this.categoryColor = '_other';
        if (cardData.category === 'дополнительное') this.categoryColor = '_additional';
        if (cardData.category === 'кнопка') this.categoryColor = '_button';
        if (cardData.category === 'хард-скил') this.categoryColor = '_hard';
    }
}

export class CardPreview extends Card {
    protected category: HTMLElement;
    protected description: HTMLElement;
    protected image: HTMLImageElement;
    protected _button: HTMLButtonElement;

    constructor(selector: string, events: IEvents) {
        super(selector, events)

        this.category = this._contentElement.querySelector('.card__category');
        this.description = this._contentElement.querySelector('.card__text');
        this.image = this._contentElement.querySelector('.card__image');
        this._button = this._contentElement.querySelector('.card__button');

        this._button.addEventListener('click', () => {
            this.events.emit(`card:change`, {id: this.id});
        })
    }

    setButton(isClicked: boolean) {
        if (isClicked) {
            this._button.textContent = 'Удалить из корзины';
        } else {
            this._button.textContent = 'В корзину';
        };
    }

    set categoryColor(color: string) {
        this.category.classList.add(`card__category${color}`);
    }

    removeCategoryColor() {
        const classes = this.category.className.split(" ").filter(category => {
            return category.lastIndexOf('card__category_', 0) !== 0;
        });
        this.category.className = classes.join(" ").trim();
    }

    setData(cardData: Partial<IProductItem>) {
        super.setData(cardData)
        this.removeCategoryColor();

        this.category.textContent = cardData.category;
        this.description.textContent = cardData.description;
        this.image.src = cardData.image;
        this.image.alt = cardData.title;

        if (cardData.category === 'софт-скил') this.categoryColor = '_soft';
        if (cardData.category === 'другое') this.categoryColor = '_other';
        if (cardData.category === 'дополнительное') this.categoryColor = '_additional';
        if (cardData.category === 'кнопка') this.categoryColor = '_button';
        if (cardData.category === 'хард-скил') this.categoryColor = '_hard';
    }
}

export class CardBasket extends Card {
    protected _button: HTMLButtonElement;

    constructor(selector: string, events: IEvents) {
        super(selector, events);

        this._button = this._contentElement.querySelector('.card__button');
        this._button.addEventListener('click', () => {
            this._contentElement.remove();
            this.events.emit(`card:change`, {id: this.id});
        });
    }
}
