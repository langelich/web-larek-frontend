import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class ContactForm extends Form {        
    constructor (template: HTMLTemplateElement, events: IEvents) {
        super(template, events);
        
        this.form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit(`success:open`);
            this.events.emit(`contacts:submit`, this.getInputValues());
        })
    }

    set email(value: string) {
        (this.form.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.form.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}
