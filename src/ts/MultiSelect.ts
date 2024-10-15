import {MultiSelectOptions} from "./MultiSelectOptions";

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
            placeholderType: 'default',
            showMaxHint: false,
            search: true,
            selectAll: false,
            closeListOnItemSelect: false,
            name: '',
            width: '',
            height: '',
            dropdownWidth: '',
            dropdownHeight: '',
            data: [],
            translations: {
                selectAll: 'Select all',
                searchPlaceholder: 'Search...',
                selected: '%i selected',
            },
            onChange: function () {
            },
            onSelect: function () {
            },
            onUnselect: function () {
            }
        } as MultiSelectOptions;
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

        this.options.selectAll = this.options.selectAll && this.options.max !== 1;

        this.name = this.selectElement.name
            ? this.selectElement.name
            : 'multi-select-' + Math.floor(Math.random() * 1000000);

        if (!this.options.data.length) {
            let options = this.selectElement.options;
            Array.from(options).forEach((option) => {
                this.options.data.push({
                    value: option.value,
                    text: option.innerHTML ?? option.value,
                    selected: option.selected ?? false,
                    html: option.dataset.msHtml ?? null,
                    isDefaultValue: false
                });
            });
        }

        // declare default values
        this.options.data.map((data) => {
            if (data.selected) {
                this.defaultValues.push(data.value);
                data.isDefaultValue = true;
            }
        });

        this.dropdown = this._template();

        // hide the original select element
        this.selectElement?.parentNode?.insertBefore(this.dropdown, this.selectElement);
        this.dropdown.appendChild(this.selectElement);
        this.selectElement.style.display = 'none';

        this._eventHandlers();
        this.update();
    }

    /**
     * Check if an option is selected
     *
     * @param value
     */
    public isSelectedValue(value: string|undefined): boolean {
        if (!value) {
            return false;
        }

        const option = this.options.data.find((data) => data.value == value);
        if (option) {
            return option.selected;
        }

        return false;
    }

    /**
     * Count the selected options
     */
    public countSelectedOptions(): number {
        return this.options.data.filter((option) => option.selected).length;
    }

    /**
     * Check if the max selection is reached
     */
    public maxSelectionReached(): boolean {
        return this.options.max && this.countSelectedOptions() >= this.options.max;
    }

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
        if (this.options.dropdownWidth) {
            multiSelectOptions.style.width = typeof this.options.dropdownWidth === 'number' ? this.options.dropdownWidth + 'px' : this.options.dropdownWidth;
        }
        if (this.options.dropdownHeight) {
            multiSelectOptions.style.height = typeof this.options.dropdownHeight === 'number' ? this.options.dropdownHeight + 'px' : this.options.dropdownHeight;
        }
        dropdown.appendChild(multiSelectOptions);

        if (this.options.search === true) {
            const multiSelectSearch = document.createElement('input');
            multiSelectSearch.classList.add('multi-select-search');
            multiSelectSearch.placeholder = this._getTranslation('searchPlaceholder');
            multiSelectOptions.appendChild(multiSelectSearch);
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

        this.options.data.forEach((data) => {
            const selected = this.isSelectedValue(data.value);

            const option = document.createElement('div');
            option.classList.add('multi-select-option');
            if (selected) {
                option.classList.add('multi-select-selected');
            }
            option.dataset.value = data.value;
            option.innerHTML = `
                <span class="multi-select-option-radio"></span>
                <span class="multi-select-option-text">${data.html ? data.html : data.text}</span>
            `;
            multiSelectOptions.appendChild(option);
            // dropdown.appendChild(option);
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

        (this.dropdown.querySelectorAll('.multi-select-option') as NodeListOf<HTMLElement>).forEach((option) => {
            option.addEventListener('click', () => {
                let selected = true;

                if (this.isSelectedValue(option.dataset.value)) {
                    this.unselectOption(option.dataset.value);
                    selected = false;
                } else {
                    this.selectOption(option.dataset.value);
                }

                if (this.options.search === true) {
                    (this.dropdown.querySelector('.multi-select-search') as HTMLInputElement).value = '';
                }

                (this.dropdown.querySelectorAll('.multi-select-option') as NodeListOf<HTMLElement>).forEach((option) => option.style.display = 'flex');

                if (this.options.closeListOnItemSelect === true) {
                    this.close();
                }

                this.options.onChange(option.dataset.value, option.querySelector('.multi-select-option-text')?.innerHTML, option);

                if (selected) {
                    this.options.onSelect(option.dataset.value, option.querySelector('.multi-select-option-text')?.innerHTML, option);
                } else {
                    this.options.onUnselect(option.dataset.value, option.querySelector('.multi-select-option-text')?.innerHTML, option);
                }
            }, {passive: true});
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

            if (!target.closest('.' + this.name) && !target.closest('label[for="' + this.selectElement.id + '"]') && target !== this.selectElement) {
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
     * @param value
     * @param preventUpdate
     */
    public selectOption(value: string|undefined, preventUpdate: boolean = false) {
        if (!value) {
            return;
        }

        this.options.data.filter((data) => data.value == value).map((option) => {

            // skip if max is reached
            if (this.maxSelectionReached()) {
                if (this.options.max !== 1) {
                    return;
                }

                // deselect all other options if max is 1
                this.options.data.filter((data) => data.value !== value).map((selectedOption) => {
                    selectedOption.selected = false;
                });
            }

            option.selected = true;

            const optionHtml = this.dropdown.querySelector(`.multi-select-option[data-value="${value}"]`);
            optionHtml?.classList.add('multi-select-selected');
        });

        if (!preventUpdate) {
            this.update();
        }
    }

    /**
     * deselect an option
     *
     * @param value
     * @param preventUpdate
     */
    public unselectOption(value: string|undefined, preventUpdate: boolean = false) {
        if (!value) {
            return;
        }

        this.options.data.filter((data) => data.value == value).map((option) => {
            // do not deselect if min is reached
            if (this.options?.min && this.countSelectedOptions() === this.options.min) {
                return;
            }

            option.selected = false;

            const optionHtml = this.dropdown.querySelector(`.multi-select-option[data-value="${value}"]`);
            optionHtml?.classList.remove('multi-select-selected');
        });

        if (!preventUpdate) {
            this.update();
        }
    }

    /**
     * select all options
     */
    public selectAll(): void {
        this.options.data.forEach((data) => {
            this.selectOption(data.value, true);
        });

        this.update();
    }

    /**
     * deselect all options
     */
    public unselectAll(): void {
        this.options.data.forEach((data) => {
            this.unselectOption(data.value, true)
        });

        this.update();
    }

    /**
     * update the dropdown and the select element
     */
    public update(): void {
        this.options.data.forEach((data) => {
            Array.from(this.selectElement.options).filter((option) => option.value == data.value).map((option) => {
                option.selected = data.selected;

                let optionHtml = this.dropdown.querySelector(`.multi-select-option[data-value="${data.value}"]`);
                if (optionHtml) {
                    if (data.selected) {
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
                if (Array.from(this.options.data).filter((data) => data.selected).length === this.options.data.length) {
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
            case 'count':
                this.dropdown.querySelector('.multi-select-header-option')?.remove();

                let label = this._getTranslation('selected');
                label = label.replace('%i', this.countSelectedOptions().toString());

                headerElement?.insertAdjacentHTML('afterbegin', `<span class="multi-select-header-option">${label}</span>`);
                break;
            default:
                this.options.data.forEach((data) => {
                    const headerOption = this.dropdown.querySelector(`.multi-select-header-option[data-value="${data.value}"]`);

                    if (!data.selected) {
                        headerOption?.remove();
                    } else {
                        if (headerOption) {
                            return;
                        }

                        const label = this.dropdown.querySelector(`.multi-select-option[data-value="${data.value}"] .multi-select-option-text`)?.innerHTML;

                        const opt = document.createElement('div');
                        opt.classList.add('multi-select-header-option');
                        opt.dataset.value = data.value;
                        opt.innerHTML = label;

                        const maxHint = this.dropdown.querySelector('.multi-select-header-max');
                        if (maxHint) {
                            maxHint.insertAdjacentElement('beforebegin', opt);
                        } else {
                            headerElement?.appendChild(opt);
                        }
                    }
                });
                break;
        }
    }

    /**
     * Reset the selection to the default values
     */
    public reset(): void {
        this.options.data.map((data) => {
            data.selected = data.isDefaultValue;
        });

        this.update();
    }
}
