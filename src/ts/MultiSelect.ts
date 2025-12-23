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

    protected buttonWrapperElement: HTMLDivElement;
    protected buttonElement: HTMLButtonElement;

    protected defaultValues: string[] = [];

    protected dropdown: HTMLElement;

    /**
     *
     * @param element {string|HTMLSelectElement}
     * @param options {{}|MultiSelectOptions}
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
        this.setOptions(options);

        this.name = this.selectElement.name
            ? this.selectElement.name
            : 'multiselect--' + Math.floor(Math.random() * 1000000);

        this._initValues();

        this._templateButton();
        this._templateDropdown();

        this.selectElement?.parentNode?.insertBefore(this.buttonWrapperElement, this.selectElement);
        this.buttonWrapperElement.appendChild(this.selectElement);
        this.selectElement.style.display = 'none';

        this._positionDropdown();

        window.addEventListener('resize', this._positionDropdown, {passive: true});
        window.addEventListener('scroll', this._positionDropdown, {passive: true, capture: true});

        this._eventHandlers();
        this.update();
        this.options.onInitialize(this);
    }

    /**
     * Set the options
     * @param options {{}|MultiSelectOptions}
     */
    protected setOptions(options = {})
    {
        let defaults = {
            placeholder: 'Select item(s)',
            max: this.selectElement.multiple ? null : 1,
            min: null,
            placeholderType: MultiSelectPlaceholderTypeEnum.default,
            showMaxHint: false,
            search: this.selectElement.options.length > 6,
            selectAll: false,
            closeListOnItemSelect: !this.selectElement.multiple,
            name: '',
            label: this.selectElement.ariaLabel ?? this.selectElement.title ?? this.selectElement.dataset.title ?? '',
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
            button: {
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

        const intOptions = [
            'min',
            'max',
        ];
        const boolOptions = [
            'showMaxHint',
            'search',
            'selectAll',
            'closeListOnItemSelect',
            'showCheckbox',
            'showApplyButton',
        ];

        this.options = Object.assign(defaults, options);
        for (const prop in this.selectElement.dataset) {
            if (!prop.startsWith('ms')) {
                continue;
            }

            let dataProp = prop.replace('ms', '');
            dataProp = dataProp[0].toLowerCase() + dataProp.slice(1) as string;
            const value = <string>this.selectElement.dataset[prop];

            if (this.options.hasOwnProperty(dataProp)) {
                if (boolOptions.includes(dataProp)) {
                    this.options[dataProp] = new Boolean(value).valueOf();
                }
                else if (intOptions.includes(dataProp)) {
                    const convValue = parseInt(value);
                    if (Object.is(convValue, value)) {
                        this.options[dataProp] = parseInt(value);
                    } else {
                        this.options[dataProp] = value;
                    }
                } else {
                    this.options[dataProp] = value;
                }
            }
        }

        if (!defaults.label) {
            this.options.label = this.options.placeholder;
        }

        if (typeof this.options.placeholderType == 'string') {
            this.options.placeholderType = getPlaceholderType(this.options.placeholderType);
        }

        this.options.selectAll = this.options.selectAll && this.options.max !== 1;
    }

    /**
     * Init the values
     */
    protected _initValues(): void
    {
        // add a default group
        if (!this.options.data.has('_default')) {
            this.options.data.set('_default', new MultiSelectGroup(null, ''));
        }

        if (this.options.data.size === 1 && this.options.data.has('_default')) {
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
    protected _templateDropdown() {
        const dropdown = document.createElement('div');
        dropdown.dataset.msFor = this.selectElement.id;
        dropdown.dataset.msForName = this.name;
        dropdown.ariaLabel = this.options.label;
        dropdown.classList.add('multiselect-dropdown');

        if (!this.options.showCheckbox) {
            dropdown.classList.add('multiselect-hide-checkbox');
        }

        if (this.options.dropdownWidth) {
            dropdown.style.width = typeof this.options.dropdownWidth === 'number' ? this.options.dropdownWidth + 'px' : this.options.dropdownWidth;
        }
        if (this.options.dropdownHeight) {
            dropdown.style.height = typeof this.options.dropdownHeight === 'number' ? this.options.dropdownHeight + 'px' : this.options.dropdownHeight;
        }

        if (this.options.search === true) {
            const multiSelectSearchWrapper = document.createElement('div');
            multiSelectSearchWrapper.classList.add('multiselect-search-wrapper');
            dropdown.appendChild(multiSelectSearchWrapper);

            const multiSelectSearch = document.createElement('input');
            multiSelectSearch.classList.add('multiselect-search');
            multiSelectSearch.placeholder = this._getTranslation('searchPlaceholder');
            multiSelectSearchWrapper.appendChild(multiSelectSearch);
        }

        if (this.options.selectAll) {
            const selectAll = document.createElement('div');
            selectAll.classList.add('multiselect-select-all');
            selectAll.innerHTML = `
                <span class="multiselect-option-radio"></span>
                <span class="multiselect-option-text">${this._getTranslation('selectAll')}</span>
            `;
            dropdown.appendChild(selectAll);
        }

        const defaultGroup = this.options.data.get('_default');
        const defaultGroupHtml = defaultGroup.render(dropdown, true);
        if (defaultGroupHtml) {
            dropdown.appendChild(defaultGroupHtml);
        }

        if (!this.options.closeListOnItemSelect && this.options.showApplyButton) {
            const multiSelectApplyButtonWrapper = document.createElement('div');
            multiSelectApplyButtonWrapper.classList.add('multiselect-apply-button-wrapper');
            dropdown.appendChild(multiSelectApplyButtonWrapper);

            const multiSelectApplyButton = document.createElement('button') as HTMLButtonElement;
            multiSelectApplyButton.classList.add('multiselect-apply-button');
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

            const html = group.render(dropdown, true);
            if (!html) {
                return;
            }

            dropdown.appendChild(html);
        });

        this.dropdown = dropdown;
        document.body.appendChild(this.dropdown);
    }

    /**
     * Create the template for the button
     * @protected
     */
    protected _templateButton(): void
    {
        const wrapper = document.createElement('div');
        wrapper.classList.add('multiselect');

        const button = document.createElement('button');
        button.classList.value = this.options.button.classList;
        button.classList.add('multiselect-button');
        button.dataset.msFor = this.selectElement.id;
        button.dataset.msForName = this.name;
        button.id = this.selectElement.id + '-dropdown';
        button.ariaLabel = this.options.label;
        button.type = 'button';

        if (this.options.width) {
            button.style.width = typeof this.options.width === 'number' ? this.options.width + 'px' : this.options.width;
        }
        if (this.options.height) {
            button.style.height = typeof this.options.height === 'number' ? this.options.height + 'px' : this.options.height;
        }

        const multiSelectHeaderMax = document.createElement('span');
        multiSelectHeaderMax.classList.add('multiselect-max-text');
        multiSelectHeaderMax.innerHTML = this.options.showMaxHint ? this.countSelectedOptions() + '/' + this.options.max : '';
        button.appendChild(multiSelectHeaderMax);

        const multiSelectHeaderPlaceholder = document.createElement('span');
        multiSelectHeaderPlaceholder.classList.add('multiselect-placeholder');
        multiSelectHeaderPlaceholder.innerHTML = this.options.placeholder;
        button.appendChild(multiSelectHeaderPlaceholder);

        wrapper.appendChild(button);

        this.buttonWrapperElement = wrapper;
        this.buttonElement = button;
    }

    /**
     * Positioniert das Dropdown relativ zum ursprünglichen Select-Platzhalter
     * @protected
     */
    protected _positionDropdown = () => {
        if (!this.buttonWrapperElement) {
            return;
        }

        const anchorRect = this.buttonWrapperElement.getBoundingClientRect();

        this.dropdown.style.position = 'absolute';
        this.dropdown.style.top = `${anchorRect.bottom + window.scrollY}px`;
        this.dropdown.style.left = `${anchorRect.left + window.scrollX}px`;
        const width = anchorRect.width || this.dropdown.getBoundingClientRect().width;
        if (width) {
            this.dropdown.style.width = `${width}px`;
        }
    }

    /**
     * Initialize the event handlers
     *
     * @protected
     */
    protected _eventHandlers() {
        this.buttonElement.addEventListener('click', () => {
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
                        (this.dropdown.querySelector('.multiselect-search') as HTMLInputElement).value = '';
                    }

                    if (this.options.closeListOnItemSelect === true) {
                        this.close();
                    }

                    this.options.onChange(optionElement.dataset.value, optionElement.querySelector('.multiselect-option-text')?.innerHTML, option, this);

                    if (selected) {
                        this.options.onSelect(optionElement.dataset.value, optionElement.querySelector('.multiselect-option-text')?.innerHTML, option, this);
                    } else {
                        this.options.onUnselect(optionElement.dataset.value, optionElement.querySelector('.multiselect-option-text')?.innerHTML, option, this);
                    }

                }, {passive: true});
            });
        });

        if (this.options.search) {
            let search = this.dropdown.querySelector('.multiselect-search') as HTMLInputElement;
            search.addEventListener('input', () => {
                (this.dropdown.querySelectorAll('.multiselect-option') as NodeListOf<HTMLElement>).forEach((option) => {
                    if (option) {
                        option.style.display = option.querySelector('.multiselect-option-text')?.innerHTML.toLowerCase().indexOf(search.value.toLowerCase()) > -1 ? 'flex' : 'none';
                    }
                });
            });
        }

        if (this.options.selectAll) {
            let selectAllButton = this.dropdown.querySelector('.multiselect-select-all');
            selectAllButton?.addEventListener('click', () => {
                let allSelected = selectAllButton.classList.contains('multiselect-selected');

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

            const dropdown = target.closest('.multiselect-dropdown');
            const trigger = target.closest('.multiselect-button');
            const label = target.closest('label[for="' + this.selectElement.id + '"]');

            if (dropdown != this.dropdown && trigger != this.buttonElement && !label && target !== this.selectElement) {
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
        this._positionDropdown();

        this.buttonElement.classList.add('active');
        this.dropdown.classList.add('open');
    }

    /**
     * Close the dropdown
     */
    public close() {
        this.buttonElement.classList.remove('active');
        this.dropdown.classList.remove('open');
    }

    /**
     * Toggle the dropdown
     */
    public toggle() {
        if (this.buttonElement.classList.contains('active')) {
            this.close();

            return;
        }

        this.open();
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
        option.getRenderedElement().classList.add('multiselect-selected');

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
        option.getRenderedElement().classList.remove('multiselect-selected');

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
                let optionHtml = this.dropdown.querySelector(`.multiselect-option[data-value="${option.getValue()}"]`);
                if (optionHtml) {
                    if (option.isSelected()) {
                        optionHtml.classList.add('multiselect-selected');
                    } else {
                        optionHtml.classList.remove('multiselect-selected');
                    }
                }
            });
        });

        // update the state of the select-all element
        if (this.options.selectAll) {
            let selectAllButton = this.dropdown.querySelector('.multiselect-select-all');

            if (selectAllButton) {
                if (this.countSelectedOptions() === this.selectElement.options.length) {
                    selectAllButton.classList.add('multiselect-selected');
                } else {
                    selectAllButton.classList.remove('multiselect-selected');
                }
            }
        }

        this.updatePlaceholder();
    }

    /**
     * Update the placeholder in the header
     */
    protected updatePlaceholder(): void {
        this.buttonElement.querySelector('.multiselect-placeholder')?.remove();

        if (this.options.showMaxHint && this.options.max) {
            const headerMax = this.buttonElement.querySelector('.multiselect-max-text');
            if (headerMax) {
                headerMax.innerHTML = this.countSelectedOptions() + '/' + this.options?.max;
            }
        }

        if (this.countSelectedOptions() === 0) {
            this.buttonElement.querySelectorAll('.multiselect-selected-option').forEach((option) => option.remove());
            this.buttonElement?.insertAdjacentHTML('afterbegin', `<span class="multiselect-placeholder">${this.options.placeholder}</span>`);

            return;
        }
        
        switch (this.options.placeholderType) {
            case MultiSelectPlaceholderTypeEnum.count:
                this.buttonElement.querySelector('.multiselect-selected-option')?.remove();

                const label = this._getTranslation('selected')
                    .replace('%i', this.countSelectedOptions().toString());

                this.buttonElement?.insertAdjacentHTML('afterbegin', `<span class="multiselect-selected-option">${label}</span>`);
                break;

            case MultiSelectPlaceholderTypeEnum.static:
                this.buttonElement.querySelector('.multiselect-selected-option')?.remove();
                this.buttonElement?.insertAdjacentHTML('afterbegin', `<span class="multiselect-selected-option">${this.options.label}</span>`);
                break;

            default:
                this.options.data.forEach((group) => {
                    group.getValues().forEach((option) => {
                        const headerOption = this.buttonElement.querySelector(`.multiselect-selected-option[data-value="${option.getValue()}"]`);
                        if (!option.isSelected()) {
                            headerOption?.remove();

                            return;
                        }

                        if (headerOption) {
                            return;
                        }

                        const label = this.dropdown.querySelector(`.multiselect-option[data-value="${option.getValue()}"] .multiselect-option-text`)?.innerHTML;
                        const opt = document.createElement('div');
                        opt.classList.add('multiselect-selected-option');
                        opt.dataset.value = option.getValue();
                        opt.innerHTML = label;

                        const maxHint = this.buttonElement.querySelector('.multiselect-max-text');
                        if (maxHint) {
                            maxHint.insertAdjacentElement('beforebegin', opt);
                        } else {
                            this.buttonElement?.appendChild(opt);
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
