import {MultiSelectOptions} from "./MultiSelectOptions";
import {MultiSelectOption,MultiSelectOptionI} from "./MultiSelectOption";
import {MultiSelectGroup} from "./MultiSelectGroup";
import {MultiSelectPlaceholderTypeEnum, getPlaceholderType} from "./MultiSelectPlaceholderTypeEnum";

/**
 * MultiSelect
 */
export class MultiSelect {
    protected selectElement: HTMLSelectElement;

    protected options: MultiSelectOptions;

    protected name: string;

    protected defaultValues: string[] = [];

    protected dropdown: HTMLElement;

    /**
     *
     * @param element {string|HTMLSelectElement}
     * @param options
     */
    constructor(element: string|HTMLSelectElement|HTMLElement, options = {}) {
        let select = element;

        if (typeof element === 'string') {
            select = document.querySelector(element) as HTMLElement;
        }

        if (!(select instanceof HTMLSelectElement)) {
            console.error('Element must be a select element but is of type ' + typeof select, select);
            throw new Error('Element must be a select element but is of type ' + typeof select);
        }

        this.selectElement = select as HTMLSelectElement;

        let defaults = {
            placeholder: 'Select item(s)',
            max: this.selectElement.multiple ? null : 1,
            min: null,
            placeholderType: MultiSelectPlaceholderTypeEnum.default,
            showMaxHint: false,
            search: select.options.length > 6,
            selectAll: false,
            closeListOnItemSelect: !select.multiple,
            name: '',
            label: select.ariaLabel ?? select.title ?? select.dataset.title ?? '',
            width: '',
            height: '',
            dropdownWidth: '',
            dropdownHeight: '',
            data: new Map(),
            showCheckbox: true,
            showApplyButton: false,
            translations: {
                selectAll: 'Select all',
                searchPlaceholder: 'Search...',
                selected: '%i selected',
                applyButton: 'Apply',
            },
            applyButton: {
                classList: '',
            },
            onInitialize: function (multiselect: MultiSelect): void {
            },
            onChange: function (value: string, label: string, option: MultiSelectOptionI, multiselect: MultiSelect): void {
                const select = option.getElement().closest('select');
                select.dispatchEvent(new Event('change'));
            },
            onSelect: function (value: string, label: string, option: MultiSelectOptionI, multiselect: MultiSelect): void {
            },
            onUnselect: function (value: string, label: string, option: MultiSelectOptionI, multiselect: MultiSelect): void {
            },
        } as MultiSelectOptions;

        if (!defaults.label) {
            defaults.label = defaults.placeholder;
        }

        this.options = Object.assign(defaults, options);
        for (const prop in this.selectElement.dataset) {
            let dataProp = prop.replace('ms', '');
            dataProp = dataProp[0].toLowerCase() + dataProp.slice(1) as string;

            if ((<string>this.options[dataProp]) ?? false) {
                if (dataProp === 'min' || dataProp === 'max') {
                    this.options[dataProp] = parseInt(<string>this.selectElement.dataset[prop]);
                } else {
                    this.options[dataProp] = this.selectElement.dataset[prop];
                }
            }
        }

        if (typeof this.options.placeholderType == 'string') {
            this.options.placeholderType = getPlaceholderType(this.options.placeholderType);
        }

        this.options.selectAll = this.options.selectAll && this.options.max !== 1;

        this.name = this.selectElement.name
            ? this.selectElement.name
            : 'multi-select-' + Math.floor(Math.random() * 1000000);

        if (!this.options.data.has('_default')) {
            this.options.data.set('_default', new MultiSelectGroup(null, ''));
        }

        if (this.options.data.size === 1) {
            this.defaultValues = this.selectElement.selectedOptions ? Array.from(this.selectElement.selectedOptions).map((option) => option.value) : [];
            const childNodes = Array.from(this.selectElement.childNodes);

            // Initialize the data
            childNodes.forEach((childNode) => {
                if (childNode instanceof HTMLOptGroupElement) {
                    const group = new MultiSelectGroup(childNode);

                    this.options.data.set(this.generateRandomString(10), group);
                } else {
                    if (childNode instanceof HTMLOptionElement) {
                        const defaultOption = this.options.data.get('_default');
                        defaultOption.addValue(new MultiSelectOption(childNode));
                    }
                }
            });
        }

        this.dropdown = this._template();

        // hide the original select element
        this.selectElement?.parentNode?.insertBefore(this.dropdown, this.selectElement);
        this.dropdown.appendChild(this.selectElement);
        this.selectElement.style.display = 'none';

        this._eventHandlers();
        this.update();
        this.options.onInitialize(this);
    }

    /**
     * Get the selected options
     */
    public getSelectedOptions = (): MultiSelectOptionI[] => {
        return Array.from(this.options.data)
            .map(([key, group]) => group.getValues())
            .reduce((a, b) => a.concat(b), [])
            .filter(option => option.isSelected());
    }

    /**
     * Count the selected options
     */
    public countSelectedOptions(): number {
        return this.getSelectedOptions().length;
    }

    /**
     * Check if the max selection is reached
     */
    public maxSelectionReached(): boolean {
        return this.options.max && this.countSelectedOptions() >= this.options.max;
    }

    /**
     * Get the translation for a key
     *
     * @param key
     * @protected
     */
    protected _getTranslation(key: string): string {
        if (!this.options.translations.hasOwnProperty(key)) {
            return key;
        }

        return this.options.translations[key];
    }

    /**
     * Create the template for the dropdown
     * @protected
     */
    protected _template() {
        const dropdown = document.createElement('div');
        dropdown.classList.add('multi-select', this.name);
        dropdown.dataset.msFor = this.selectElement.id;
        dropdown.id = this.selectElement.id + '-dropdown';
        dropdown.ariaLabel = this.options.label;

        if (this.options.width) {
            dropdown.style.width = typeof this.options.width === 'number' ? this.options.width + 'px' : this.options.width;
        }
        if (this.options.height) {
            dropdown.style.height = typeof this.options.height === 'number' ? this.options.height + 'px' : this.options.height;
        }

        const multiSelectHeader = document.createElement('div');
        multiSelectHeader.classList.add('multi-select-header');
        if (this.options.width) {
            multiSelectHeader.style.width = typeof this.options.width === 'number' ? this.options.width + 'px' : this.options.width;
        }
        if (this.options.height) {
            multiSelectHeader.style.height = typeof this.options.height === 'number' ? this.options.height + 'px' : this.options.height;
        }
        dropdown.appendChild(multiSelectHeader);

        const multiSelectHeaderMax = document.createElement('span');
        multiSelectHeaderMax.classList.add('multi-select-header-max');
        multiSelectHeaderMax.innerHTML = this.options.showMaxHint ? this.countSelectedOptions() + '/' + this.options.max : '';
        multiSelectHeader.appendChild(multiSelectHeaderMax);

        const multiSelectHeaderPlaceholder = document.createElement('span');
        multiSelectHeaderPlaceholder.classList.add('multi-select-header-placeholder');
        multiSelectHeaderPlaceholder.innerHTML = this.options.placeholder;
        multiSelectHeader.appendChild(multiSelectHeaderPlaceholder);

        const multiSelectOptions = document.createElement('div');
        multiSelectOptions.classList.add('multi-select-options');

        if (!this.options.showCheckbox) {
            multiSelectOptions.classList.add('multi-select-hide-checkbox');
        }

        if (this.options.dropdownWidth) {
            multiSelectOptions.style.width = typeof this.options.dropdownWidth === 'number' ? this.options.dropdownWidth + 'px' : this.options.dropdownWidth;
        }
        if (this.options.dropdownHeight) {
            multiSelectOptions.style.height = typeof this.options.dropdownHeight === 'number' ? this.options.dropdownHeight + 'px' : this.options.dropdownHeight;
        }
        dropdown.appendChild(multiSelectOptions);

        if (this.options.search === true) {
            const multiSelectSearchWrapper = document.createElement('div');
            multiSelectSearchWrapper.classList.add('multi-select-search-wrapper');
            multiSelectOptions.appendChild(multiSelectSearchWrapper);

            const multiSelectSearch = document.createElement('input');
            multiSelectSearch.classList.add('multi-select-search');
            multiSelectSearch.placeholder = this._getTranslation('searchPlaceholder');
            multiSelectSearchWrapper.appendChild(multiSelectSearch);
        }

        if (this.options.selectAll) {
            const selectAll = document.createElement('div');
            selectAll.classList.add('multi-select-all');
            selectAll.innerHTML = `
                <span class="multi-select-option-radio"></span>
                <span class="multi-select-option-text">${this._getTranslation('selectAll')}</span>
            `;
            multiSelectOptions.appendChild(selectAll);
        }

        const defaultGroup = this.options.data.get('_default');
        const defaultGroupHtml = defaultGroup.render(multiSelectOptions, true);
        if (defaultGroupHtml) {
            multiSelectOptions.appendChild(defaultGroupHtml);
        }

        if (!this.options.closeListOnItemSelect && this.options.showApplyButton) {
            const multiSelectApplyButtonWrapper = document.createElement('div');
            multiSelectApplyButtonWrapper.classList.add('multi-select-apply-button-wrapper');
            multiSelectOptions.appendChild(multiSelectApplyButtonWrapper);

            const multiSelectApplyButton = document.createElement('button') as HTMLButtonElement;
            multiSelectApplyButton.classList.add('multi-select-apply-button');
            multiSelectApplyButton.type = 'button';
            multiSelectApplyButton.classList.value = this.options.applyButton.classList;
            multiSelectApplyButton.innerHTML = this._getTranslation('applyButton');

            multiSelectApplyButton.addEventListener('click', function () {
                this.close();
            }.bind(this));

            multiSelectApplyButtonWrapper.appendChild(multiSelectApplyButton);
        }

        this.options.data.forEach((group, key) => {
            if (key === '_default') {
                return;
            }

            const html = group.render(multiSelectOptions, true);
            if (!html) {
                return;
            }

            multiSelectOptions.appendChild(html);
        });

        let element = document.createElement('div');
        element.appendChild(dropdown);

        return element;
    }

    /**
     * Initialize the event handlers
     *
     * @protected
     */
    protected _eventHandlers() {
        const headerElement = this.dropdown.querySelector('.multi-select-header');
        if (!headerElement) {
            return;
        }

        headerElement.addEventListener('click', () => {
            this.toggle();
        });

        this.options.data.forEach((group) => {
            group.getValues().forEach((option) => {
                const optionElement = option.getRenderedElement();

                optionElement.addEventListener('click', () => {
                    let selected = true;

                    if (option.isSelected()) {
                        this.unselectOption(option);
                        selected = false;
                    } else {
                        this.selectOption(option);
                    }

                    if (this.options.search === true) {
                        (this.dropdown.querySelector('.multi-select-search') as HTMLInputElement).value = '';
                    }

                    if (this.options.closeListOnItemSelect === true) {
                        this.close();
                    }

                    this.options.onChange(optionElement.dataset.value, optionElement.querySelector('.multi-select-option-text')?.innerHTML, option, this);

                    if (selected) {
                        this.options.onSelect(optionElement.dataset.value, optionElement.querySelector('.multi-select-option-text')?.innerHTML, option, this);
                    } else {
                        this.options.onUnselect(optionElement.dataset.value, optionElement.querySelector('.multi-select-option-text')?.innerHTML, option, this);
                    }

                }, {passive: true});
            });
        });

        if (this.options.search) {
            let search = this.dropdown.querySelector('.multi-select-search') as HTMLInputElement;
            search.addEventListener('input', () => {
                (this.dropdown.querySelectorAll('.multi-select-option') as NodeListOf<HTMLElement>).forEach((option) => {
                    if (option) {
                        option.style.display = option.querySelector('.multi-select-option-text')?.innerHTML.toLowerCase().indexOf(search.value.toLowerCase()) > -1 ? 'flex' : 'none';
                    }
                });
            });
        }

        if (this.options.selectAll) {
            let selectAllButton = this.dropdown.querySelector('.multi-select-all');
            selectAllButton?.addEventListener('click', () => {
                let allSelected = selectAllButton.classList.contains('multi-select-selected');

                if (allSelected) {
                    this.unselectAll();
                } else {
                    this.selectAll();
                }
            });
        }

        if (this.selectElement.id && document.querySelector('label[for="' + this.selectElement.id + '"]')) {
            document.querySelector('label[for="' + this.selectElement.id + '"]')?.addEventListener('click', () => {
                this.toggle();
            });
        }

        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            if (!target.closest('.' + this.escapeCssSelector(this.name)) && !target.closest('label[for="' + this.selectElement.id + '"]') && target !== this.selectElement) {
                this.close();
            }
        });

        // check if the select element is part of a form
        if (this.selectElement.closest('form')) {
            const form = this.selectElement.closest('form');

            // reset the selection if the form is reset
            form.addEventListener('reset', () => {
                this.reset();
            });
        }

        this.selectElement.addEventListener('multiselect.reset', () => {
            this.reset();
        });

        this.selectElement.addEventListener('multiselect.update', () => {
            this.update();
        });
        this.selectElement.addEventListener('change', (e) => {
            if (e instanceof CustomEvent) {
                return;
            }

            this.update();
        });
    }

    /**
     * Open the dropdown
     */
    public open() {
        this.dropdown.querySelector('.multi-select-header')?.classList.add('multi-select-header-active');
    }

    /**
     * Close the dropdown
     */
    public close() {
        this.dropdown.querySelector('.multi-select-header')?.classList.remove('multi-select-header-active');
    }

    /**
     * Toggle the dropdown
     */
    public toggle() {
        this.dropdown.querySelector('.multi-select-header')?.classList.toggle('multi-select-header-active');
    }

    /**
     * select an option
     *
     * @param option
     * @param preventUpdate
     */
    public selectOption(option: MultiSelectOptionI|undefined, preventUpdate: boolean = false) {
        if (!option) {
            return;
        }
        if (this.maxSelectionReached()) {
            if (this.options.max !== 1) {
                return;
            }

            // deselect all other options if max is 1
            this.unselectAll();
        }

        option.select();
        option.getRenderedElement().classList.add('multi-select-selected');

        if (!preventUpdate) {
            this.update();
        }
    }

    /**
     * deselect an option
     *
     * @param option
     * @param preventUpdate
     */
    public unselectOption(option: MultiSelectOptionI|undefined, preventUpdate: boolean = false) {
        if (!option) {
            return;
        }

        // do not deselect if min is reached
        if (this.options.min && this.countSelectedOptions() === this.options.min) {
            return;
        }

        option.unselect();
        option.getRenderedElement().classList.remove('multi-select-selected');

        if (!preventUpdate) {
            this.update();
        }
    }

    /**
     * select all options
     */
    public selectAll(): void {
        this.options.data.forEach((group) => {
            group.getValues().forEach((option) => {
                this.selectOption(option, true);
            });
        })

        this.update();
    }

    /**
     * deselect all options
     */
    public unselectAll(): void {
        this.options.data.forEach((group) => {
            group.getValues().forEach((option) => {
                this.unselectOption(option, true);
            });
        })

        this.update();
    }

    /**
     * update the dropdown and the select element
     */
    public update(): void {
        const values = Array.from(this.selectElement.options).map((option) => option.value);

        this.options.data.forEach((group) => {
            group.getValues().filter((option) => values.includes(option.getValue())).map((option) => {
                let optionHtml = this.dropdown.querySelector(`.multi-select-option[data-value="${option.getValue()}"]`);
                if (optionHtml) {
                    if (option.isSelected()) {
                        optionHtml.classList.add('multi-select-selected');
                    } else {
                        optionHtml.classList.remove('multi-select-selected');
                    }
                }
            });
        });

        // update the state of the select-all element
        if (this.options.selectAll) {
            let selectAllButton = this.dropdown.querySelector('.multi-select-all');

            if (selectAllButton) {
                if (this.countSelectedOptions() === this.selectElement.options.length) {
                    selectAllButton.classList.add('multi-select-selected');
                } else {
                    selectAllButton.classList.remove('multi-select-selected');
                }
            }
        }

        this.updatePlaceholder();
    }

    /**
     * Update the placeholder in the header
     */
    protected updatePlaceholder(): void {
        const headerElement = this.dropdown.querySelector('.multi-select-header');

        this.dropdown.querySelector('.multi-select-header-placeholder')?.remove();

        if (this.options.showMaxHint && this.options.max) {
            const headerMax = this.dropdown.querySelector('.multi-select-header-max');
            if (headerMax) {
                headerMax.innerHTML = this.countSelectedOptions() + '/' + this.options?.max;
            }
        }

        if (this.countSelectedOptions() === 0) {
            this.dropdown.querySelectorAll('.multi-select-header-option').forEach((option) => option.remove());
            headerElement?.insertAdjacentHTML('afterbegin', `<span class="multi-select-header-placeholder">${this.options.placeholder}</span>`);

            return;
        }

        switch (this.options.placeholderType) {
            case MultiSelectPlaceholderTypeEnum.count:
                this.dropdown.querySelector('.multi-select-header-option')?.remove();

                const label = this._getTranslation('selected')
                    .replace('%i', this.countSelectedOptions().toString());

                headerElement?.insertAdjacentHTML('afterbegin', `<span class="multi-select-header-option">${label}</span>`);
                break;

            case MultiSelectPlaceholderTypeEnum.static:
                this.dropdown.querySelector('.multi-select-header-option')?.remove();
                headerElement?.insertAdjacentHTML('afterbegin', `<span class="multi-select-header-option">${this.options.label}</span>`);
                break;

            default:
                this.options.data.forEach((group) => {
                    group.getValues().forEach((option) => {
                        const headerOption = this.dropdown.querySelector(`.multi-select-header-option[data-value="${option.getValue()}"]`);
                        if (!option.isSelected()) {
                            headerOption?.remove();

                            return;
                        }

                        if (headerOption) {
                            return;
                        }

                        const label = this.dropdown.querySelector(`.multi-select-option[data-value="${option.getValue()}"] .multi-select-option-text`)?.innerHTML;

                        const opt = document.createElement('div');
                        opt.classList.add('multi-select-header-option');
                        opt.dataset.value = option.getValue();
                        opt.innerHTML = label;

                        const maxHint = this.dropdown.querySelector('.multi-select-header-max');
                        if (maxHint) {
                            maxHint.insertAdjacentElement('beforebegin', opt);
                        } else {
                            headerElement?.appendChild(opt);
                        }
                    });
                });
                break;
        }
    }

    /**
     * Reset the selection to the default values
     */
    public reset(): void {
        this.options.data.forEach((group) => {
            group.getValues().forEach((option) => {
                if (option.isDefaultValue()) {
                    this.selectOption(option, true);
                } else {
                    this.unselectOption(option, true);
                }
            });
        });

        this.update();
    }

    /**
     * Generate a random string
     *
     * @param length
     * @protected
     */
    protected generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        // Erstelle ein Array mit zufälligen Werten
        const randomValues = new Uint8Array(length);
        crypto.getRandomValues(randomValues);

        // Erzeuge den zufälligen String
        return Array.from(randomValues, byte => characters.charAt(byte % charactersLength)).join('');
    }

    /**
     * Escape a css selector
     *
     * @param selector
     * @protected
     */
    protected escapeCssSelector(selector: string): string {
        return selector.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
    }

    public getDropdownElement(): HTMLElement
    {
        return this.dropdown;
    }
}
