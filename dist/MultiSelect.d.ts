import { MultiSelectOptions } from "./MultiSelectOptions";
/**
 * MultiSelect
 */
export declare class MultiSelect {
    protected selectElement: HTMLSelectElement;
    protected options: MultiSelectOptions;
    protected name: string;
    protected defaultValues: string[];
    protected dropdown: HTMLElement;
    /**
     *
     * @param element {string|HTMLSelectElement}
     * @param options
     */
    constructor(element: string | HTMLSelectElement | HTMLElement, options?: {});
    /**
     * Check if an option is selected
     *
     * @param value
     */
    isSelectedValue(value: string | undefined): boolean;
    /**
     * Count the selected options
     */
    countSelectedOptions(): number;
    /**
     * Check if the max selection is reached
     */
    maxSelectionReached(): boolean;
    protected _getTranslation(key: string): string;
    /**
     * Create the template for the dropdown
     * @protected
     */
    protected _template(): HTMLDivElement;
    /**
     * Initialize the event handlers
     *
     * @protected
     */
    protected _eventHandlers(): void;
    /**
     * Open the dropdown
     */
    open(): void;
    /**
     * Close the dropdown
     */
    close(): void;
    /**
     * Toggle the dropdown
     */
    toggle(): void;
    /**
     * select an option
     *
     * @param value
     * @param preventUpdate
     */
    selectOption(value: string | undefined, preventUpdate?: boolean): void;
    /**
     * deselect an option
     *
     * @param value
     * @param preventUpdate
     */
    unselectOption(value: string | undefined, preventUpdate?: boolean): void;
    /**
     * select all options
     */
    selectAll(): void;
    /**
     * deselect all options
     */
    unselectAll(): void;
    /**
     * update the dropdown and the select element
     */
    update(): void;
    /**
     * Update the placeholder in the header
     */
    protected updatePlaceholder(): void;
    /**
     * Reset the selection to the default values
     */
    reset(): void;
}
