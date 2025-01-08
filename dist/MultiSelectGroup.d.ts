import { MultiSelectOptionI } from "./MultiSelectOption";
export interface MultiSelectGroupI {
    getLabel(): string;
    getValues(): MultiSelectOptionI[];
    addValue(MultiSelectOption: any): void;
    removeValue(MultiSelectOption: any): void;
    getHtml(): string | null;
    getElement(): HTMLOptGroupElement | null;
    render(baseElement: HTMLElement, updateRenderedElement: boolean): HTMLElement;
}
export declare class MultiSelectGroup implements MultiSelectGroupI {
    protected label: string;
    protected values: MultiSelectOptionI[];
    protected html: string | null;
    protected element: HTMLOptGroupElement | null;
    protected renderedElement: HTMLElement;
    constructor(element: HTMLOptGroupElement | null, label?: string, values?: MultiSelectOptionI[], html?: string | null);
    getLabel(): string;
    getValues(): MultiSelectOptionI[];
    addValue(value: MultiSelectOptionI): void;
    removeValue(value: MultiSelectOptionI): void;
    getHtml(): string | null;
    getElement(): HTMLOptGroupElement | null;
    protected getOptions(): MultiSelectOptionI[];
    render(baseElement: HTMLElement, updateRenderedElement?: boolean): HTMLElement | null;
    getRenderedElement(): HTMLElement;
}
