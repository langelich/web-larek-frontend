import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class OrderForm extends Form {
    protected buttonCard: HTMLButtonElement;
    protected buttonCash: HTMLButtonElement;
    protected button: NodeListOf<HTMLButtonElement>

    constructor (template: HTMLTemplateElement, events: IEvents) {
        super(template, events);

        this.buttonCard = this._form.querySelector('[name=card]');
        this.buttonCash = this._form.querySelector('[name=cash]');
        this.button = this._form.querySelectorAll('.button_alt');

        this.button.forEach(item => {
            item.addEventListener('click', () => {
                this.events.emit('order:change', {payment: item.name})
            })
        })
    }

    set payment (value: string) {
        if (value === 'card') {
            this.buttonCard.classList.add('button_alt-active');
            this.buttonCash.classList.remove('button_alt-active');
        } else if (value === 'cash'){
            this.buttonCash.classList.add('button_alt-active');
            this.buttonCard.classList.remove('button_alt-active');
        }
    }

    set address(value: string) {
        (this.form.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}
