import { IEvents } from "../base/events";

export interface IContent {
    contentElement: HTMLElement;
}

export class Modal {
    protected modalContainer: HTMLElement;
    protected _contentElement: HTMLElement;
    protected modalClose: HTMLButtonElement
    protected events: IEvents;

    constructor (selector: string, events: IEvents) {
        this.modalContainer = document.querySelector(selector)
        this._contentElement = this.modalContainer.querySelector('.modal__content');
        this.modalClose = this.modalContainer.querySelector('.modal__close');
        this.events = events;

        this.modalClose.addEventListener('click', () => this.close());

        const closeFunction = (function () {
            this.close();
        }).bind(this);

        this.modalContainer.addEventListener('click', function (evt) {
            if (evt.currentTarget === evt.target) {
              closeFunction();
            }
        })

        document.addEventListener('keydown', function (evt) {
            if (evt.key == "Escape") {
              closeFunction();
            }
          })
    }

    set contentElement (value: HTMLElement) {
      this._contentElement.replaceChildren(value);
    }

    open() {
        this.modalContainer.classList.add('modal_active');
        this.events.emit('мodal:open');
    }

	  close() {
        this.modalContainer.classList.remove('modal_active');
        this.events.emit('мodal:close');
    }

    render(element: HTMLElement): HTMLElement {
        this.contentElement = element;
        this.open();
        return this.modalContainer;
    }
}
