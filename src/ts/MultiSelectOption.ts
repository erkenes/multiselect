import {MultiSelectGroupI} from "./MultiSelectGroup";

export interface MultiSelectOptionI {
    getElement(): HTMLOptionElement;
    getLabel(): string;
    getValue(): string;
    isSelected(): boolean;
    select(): void;
    unselect(): void;
    isDefaultValue(): boolean;
    getHtml(): string|null;
    render(group: MultiSelectGroupI, updateRenderedElement: boolean): HTMLElement;
    getRenderedElement(): HTMLElement;
}

export class MultiSelectOption implements MultiSelectOptionI {
    protected element: HTMLOptionElement;
    protected label: string;
    protected value: string;
    protected html: string|null;
    protected defaultValue: boolean;
    protected renderedElement: HTMLElement;

    constructor(
        element: HTMLOptionElement,
        label: string = undefined,
        value: string = undefined,
        html: string|null = undefined,
        defaultValue: boolean = undefined
    ) {
        if (label === undefined) {
            label = element.label ?? element.innerText;
        }
        if (value === undefined) {
            value = element.value;
        }
        if (html === undefined) {
            html = element.dataset.msHtml ?? null;
        }
        if (defaultValue === undefined) {
            defaultValue = element.defaultSelected;
        }

        this.element = element;
        this.label = label;
        this.value = value;
        this.defaultValue = defaultValue;
        this.html = html;
    }

    public getElement(): HTMLOptionElement {
        return this.element;
    }

    public getLabel(): string {
        return this.label;
    }

    public getValue(): string {
        return this.value;
    }

    public isSelected(): boolean {
        return this.element.selected;
    }

    public select(): void {
        this.element.selected = true;
    }

    public unselect(): void {
        this.element.selected = false;
    }

    public isDefaultValue(): boolean {
        return this.defaultValue;
    }

    public getHtml(): string|null {
        return this.html;
    }

    public render(group: MultiSelectGroupI, updateRenderedElement: boolean = false): HTMLElement {
        const option = document.createElement('li');
        option.classList.add('multiselect-option');
        if (this.isSelected()) {
            option.classList.add('multiselect-selected');
        }
        option.dataset.value = this.getValue();
        option.innerHTML = `
                <span class="multiselect-option-radio"></span>
                <span class="multiselect-option-text">${this.getHtml() ? this.getHtml() : (this.getLabel()  ? this.getLabel(): this.getValue())}</span>
            `;

        if (updateRenderedElement) {
            this.renderedElement = option;
        }

        return option;
    }

    public getRenderedElement(): HTMLElement {
        return this.renderedElement;
    }
}
