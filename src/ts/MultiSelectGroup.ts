import {MultiSelectOption, MultiSelectOptionI} from "./MultiSelectOption";

export interface MultiSelectGroupI {
    getLabel(): string;
    getValues(): MultiSelectOptionI[];
    addValue(MultiSelectOption): void;
    removeValue(MultiSelectOption): void;
    getHtml(): string|null;
    getElement(): HTMLOptGroupElement|null;
    render(baseElement: HTMLElement, updateRenderedElement: boolean): HTMLElement;
}

export class MultiSelectGroup implements MultiSelectGroupI {
    protected label: string;
    protected values: MultiSelectOptionI[] = [];
    protected html: string|null;
    protected element: HTMLOptGroupElement|null = null;
    protected renderedElement: HTMLElement;

    constructor(
        element: HTMLOptGroupElement|null,
        label: string = undefined,
        values: MultiSelectOptionI[] = undefined,
        html: string|null = undefined
    ) {
        if (html === undefined) {
            html = element?.dataset.msHtml ?? null;
        }
        if (label === undefined) {
            label = element?.getAttribute('label') ?? '';
        }

        this.element = element;
        this.label = label;
        this.html = html;

        if (values === undefined && element) {
            values = this.getOptions();
        }

        this.values = values ?? [];
    }

    public getLabel(): string {
        return this.label;
    }

    public getValues(): MultiSelectOptionI[] {
        return this.values;
    }

    public addValue(value: MultiSelectOptionI): void {
        this.values.push(value);
    }

    public removeValue(value: MultiSelectOptionI): void {
        const index = this.values.indexOf(value);
        if (index > -1) {
            this.values.splice(index, 1);
        }
    }

    public getHtml(): string|null {
        return this.html;
    }

    public getElement(): HTMLOptGroupElement | null {
        return this.element;
    }

    protected getOptions(): MultiSelectOptionI[] {
        const options = Array.from(this.element?.childNodes).filter((node: Node) => {
            return node instanceof HTMLOptionElement;
        }) as HTMLOptionElement[];

        return options?.map((option: HTMLOptionElement) => {
            return new MultiSelectOption(option);
        });
    }

    public render(baseElement: HTMLElement, updateRenderedElement: boolean = false): HTMLElement|null {
        if (!this.getValues().length) {
            return null;
        }

        const groupElement = document.createElement('div');
        groupElement.classList.add('multiselect-group');

        const groupLabel = document.createElement('div');
        groupLabel.classList.add('multiselect-group-label');
        groupLabel.innerHTML = this.getLabel();
        groupElement.appendChild(groupLabel);

        const groupOptions = document.createElement('ul');
        groupOptions.classList.add('multiselect-group-options');
        groupElement.appendChild(groupOptions);

        this.getValues().forEach((option) => {
            groupOptions.appendChild(option.render(this, true));
        });

        const divider = document.createElement('div');
        divider.classList.add('multiselect-divider');
        groupElement.appendChild(divider);

        if (updateRenderedElement) {
            this.renderedElement = groupElement;
        }

        return groupElement;
    }

    public getRenderedElement(): HTMLElement {
        return this.renderedElement;
    }
}
