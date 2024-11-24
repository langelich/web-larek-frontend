import { IEvents } from "../base/events";

export interface IContent {
    contentElement?: HTMLElement;
    form?: HTMLFormElement;
}

export class Modal {
    protected modalContainer: HTMLElement;
    protected _modalContent: HTMLElement;
    protected modalClose: HTMLButtonElement
    protected events: IEvents;

    constructor (selector: string, events: IEvents) {
        this.modalContainer = document.querySelector(selector) 
        this._modalContent = this.modalContainer.querySelector('.modal__content');
        this.modalClose = this.modalContainer.querySelector('.modal__close');
        this.events = events;

        this.modalClose.addEventListener('click', () => this.close());

        this.modalContainer.addEventListener('click', (evt) =>
             (evt.currentTarget === evt.target) ? this.close() : {/* */} )     
        
        document.addEventListener('keydown', (evt) =>
            (evt.key == "Escape") ? this.close() : {/* */} )     
    }

    set modalContent (element: HTMLElement) {
        this._modalContent.replaceChildren(element);
    }

    open() {
        this.modalContainer.classList.add('modal_active');
        this.events.emit('мodal:open');
    }
    
	close() {
        this.modalContainer.classList.remove('modal_active');
        this.events.emit('мodal:close');
    }

    render(content: IContent): HTMLElement {
        (content.contentElement) ? this.modalContent = content.contentElement : this.modalContent = content.form;
        this.open();
        return this.modalContainer;
    }
}
