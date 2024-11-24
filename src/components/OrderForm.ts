import { IEvents } from "./base/events";
import { Form } from "./common/Form";


export class OrderForm extends Form {        
    protected button: NodeListOf<HTMLInputElement>

    constructor (template: HTMLTemplateElement, events: IEvents) {
        super(template, events);
        
        this.button = this.form.querySelectorAll('.button_alt');

        this.button[0].addEventListener('click', () => {
            if (!this.button[0].classList.contains('button_alt-active')) {
                this.button[0].classList.add('button_alt-active');
                this.button[1].classList.remove('button_alt-active');
            }
        })

        this.button[1].addEventListener('click', () => {
            if (!this.button[1].classList.contains('button_alt-active')) {
                this.button[1].classList.add('button_alt-active');
                this.button[0].classList.remove('button_alt-active');
            }
        })

        this.form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit(`contacts:open`);
            this.events.emit(`order:submit`, this.getInputValues());
        })
    }

    set payment (value: string) {
        this.payment = value;
    }

    set address(value: string) {
        (this.form.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}
