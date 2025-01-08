import { MultiSelectGroupI } from "./MultiSelectGroup";
export interface MultiSelectOptionI {
    getElement(): HTMLOptionElement;
    getLabel(): string;
    getValue(): string;
    isSelected(): boolean;
    select(): void;
    unselect(): void;
    isDefaultValue(): boolean;
    getHtml(): string | null;
    render(group: MultiSelectGroupI, updateRenderedElement: boolean): HTMLElement;
    getRenderedElement(): HTMLElement;
}
export declare class MultiSelectOption implements MultiSelectOptionI {
    protected element: HTMLOptionElement;
    protected label: string;
    protected value: string;
    protected html: string | null;
    protected defaultValue: boolean;
    protected renderedElement: HTMLElement;
    constructor(element: HTMLOptionElement, label?: string, value?: string, html?: string | null, defaultValue?: boolean);
    getElement(): HTMLOptionElement;
    getLabel(): string;
    getValue(): string;
    isSelected(): boolean;
    select(): void;
    unselect(): void;
    isDefaultValue(): boolean;
    getHtml(): string | null;
    render(group: MultiSelectGroupI, updateRenderedElement?: boolean): HTMLElement;
    getRenderedElement(): HTMLElement;
}
