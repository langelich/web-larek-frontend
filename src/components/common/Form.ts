import { cloneTemplate } from "../../utils/utils";
import { ContentStepByStep } from "../base/ContentStepByStep";
import { IEvents } from "../base/events";

export class Form extends ContentStepByStep{
    protected modalActions: HTMLElement;
    protected modalButton: HTMLButtonElement;
    protected _form: HTMLFormElement;
    protected formName: string;
    protected inputs: NodeListOf<HTMLInputElement>;
    protected _formError: HTMLElement;
    protected events: IEvents;

    constructor(template: HTMLTemplateElement, events: IEvents) {
        super();
        this._form = cloneTemplate(template);
        this.modalActions = this._form.querySelector('.modal__actions');
        this.formName = this._form.name;
        this.modalButton = this.modalActions.querySelector('.button');
        this.inputs = this._form.querySelectorAll('.form__input')
        this._formError = this.modalActions.querySelector('.form__errors');
        this.events = events;

        this._form.addEventListener('input', () => {
            const valuesNot = Object.values(this.getInputValues()).filter(item => item.length === 0)
            if (valuesNot.length === 0) {
              this.hideError();
              this.setValid(true);
            } else {
              this.showError();
              this.setValid(false);
            }
        })

        this.form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit(`${this.formName}:submit`, this.getInputValues());
      })

    }

    getInputValues() {
        const valuesObject: Record<string, string> = {}
        this.inputs.forEach(element => {
            const value = element.value;
            valuesObject[element.name] = value;
        })
        return valuesObject;
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
