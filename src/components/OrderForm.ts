import { IEvents } from "./base/events";
import { Form } from "./common/Form";


export class OrderForm extends Form {
    protected buttonCard: HTMLButtonElement;
    protected buttonCash: HTMLButtonElement

    constructor (template: HTMLTemplateElement, events: IEvents) {
        super(template, events);

        this.buttonCard = this._form.querySelector('[name=card]');
        this.buttonCash = this._form.querySelector('[name=cash]');

        this.buttonCard.addEventListener('click', () =>{
          this.events.emit('order:click', {payment: this.buttonCard.name});
        });

        this.buttonCash.addEventListener('click', () =>{
          this.events.emit('order:click', {payment: this.buttonCash.name});
        });
    }

    set payment (value: string) {
        if (value === 'card')
         {this.buttonCard.classList.add('button_alt-active');
          this.buttonCash.classList.remove('button_alt-active');
        }  else  {
          this.buttonCash.classList.add('button_alt-active');
          this.buttonCard.classList.remove('button_alt-active');
        }
    }

    set address(value: string) {
        (this.form.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}
