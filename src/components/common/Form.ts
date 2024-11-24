import { TOrder } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { ContentStepByStep } from "../base/ContentStepByStep";
import { IEvents } from "../base/events";

export class Form extends ContentStepByStep{
    protected modalActions: HTMLElement;
    protected modalButton: HTMLButtonElement;
    protected _form: HTMLFormElement;
    protected inputs: NodeListOf<HTMLInputElement>;
    protected _formError: HTMLElement;
    protected events: IEvents;

    constructor(template: HTMLTemplateElement, events: IEvents) {
        super();
        this._form = cloneTemplate(template);
        this.modalActions = this._form.querySelector('.modal__actions');
        this.modalButton = this.modalActions.querySelector('.button');
        this.inputs = this._form.querySelectorAll('.form__input')
        this._formError = this.modalActions.querySelector('.form__errors');
        this.events = events;

        this._form.addEventListener('input', () => {
            console.log(this.inputs)
            this.getValues() ? this.setValid(true) : this.setValid(false);
            this.setError(this.getValues());  
        })
    }

    getInputValues() {
        const valuesObject: Record<string, string> = {}
        this.inputs.forEach(element => {
            const value = element.value;
            valuesObject[element.name] = value
        })
        return valuesObject;
    }

    getValues() {
        let input: string;
        this.inputs.forEach(element => {
            input = element.value;
        })
        return input;
    }

    setError(value: string) {
        if (!value) {
            this.showError();
        } else {
            this.hideError();
        }
    }
    
    showError() {
        this._formError.textContent = "Заполните все поля ввода";
    }

    hideError() {
        this._formError.textContent = "";
    }

    get form() {
        return this._form;
    }
}
