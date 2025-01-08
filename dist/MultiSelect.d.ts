import { MultiSelectOptions } from "./MultiSelectOptions";
import { MultiSelectOptionI } from "./MultiSelectOption";
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
     * Get the selected options
     */
    getSelectedOptions: () => MultiSelectOptionI[];
    /**
     * Count the selected options
     */
    countSelectedOptions(): number;
    /**
     * Check if the max selection is reached
     */
    maxSelectionReached(): boolean;
    /**
     * Get the translation for a key
     *
     * @param key
     * @protected
     */
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
     * @param option
     * @param preventUpdate
     */
    selectOption(option: MultiSelectOptionI | undefined, preventUpdate?: boolean): void;
    /**
     * deselect an option
     *
     * @param option
     * @param preventUpdate
     */
    unselectOption(option: MultiSelectOptionI | undefined, preventUpdate?: boolean): void;
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
    /**
     * Generate a random string
     *
     * @param length
     * @protected
     */
    protected generateRandomString(length: number): string;
    /**
     * Escape a css selector
     *
     * @param selector
     * @protected
     */
    protected escapeCssSelector(selector: string): string;
}
