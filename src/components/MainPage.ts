import { IEvents } from "./base/events";

export class MainPage {
    protected container: HTMLElement;
    protected _gallery: HTMLElement;
    protected _basketCounter: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected _wrapper: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        this.container = container;
        this._gallery = this.container.querySelector<HTMLElement>('.gallery');
        this._basketCounter = document.querySelector('.header__basket-counter');
        this.basketButton = document.querySelector('.header__basket');
        this._wrapper = document.querySelector('.page__wrapper');
        this.events = events;

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basketView:open', this);
        })
    }

    set basketCounter(value: number) {
        this._basketCounter.textContent = `${value}`;
    }

    set gallery (items: HTMLElement[]) {
        this._gallery.append(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
