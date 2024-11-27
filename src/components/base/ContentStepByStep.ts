export abstract class ContentStepByStep {

    protected modalButton: HTMLButtonElement;

    setValid (isValid: boolean) {
        if (!isValid) {
            this.modalButton.setAttribute('disabled', 'disabled');
        } else {
            this.modalButton.removeAttribute('disabled');
        }
    }
}
