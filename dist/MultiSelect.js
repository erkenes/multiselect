import { MultiSelectOption } from "./MultiSelectOption";
import { MultiSelectGroup } from "./MultiSelectGroup";
import { MultiSelectPlaceholderTypeEnum, getPlaceholderType } from "./MultiSelectPlaceholderTypeEnum";
/**
 * MultiSelect
 */
export class MultiSelect {
    /**
     *
     * @param element {string|HTMLSelectElement}
     * @param options
     */
    constructor(element, options = {}) {
        var _a, _b, _c, _d, _e, _f;
        this.defaultValues = [];
        /**
         * Get the selected options
         */
        this.getSelectedOptions = () => {
            return Array.from(this.options.data)
                .map(([key, group]) => group.getValues())
                .reduce((a, b) => a.concat(b), [])
                .filter(option => option.isSelected());
        };
        let select = element;
        if (typeof element === 'string') {
            select = document.querySelector(element);
        }
        if (!(select instanceof HTMLSelectElement)) {
            console.error('Element must be a select element but is of type ' + typeof select, select);
            throw new Error('Element must be a select element but is of type ' + typeof select);
        }
        this.selectElement = select;
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
            label: (_c = (_b = (_a = select.ariaLabel) !== null && _a !== void 0 ? _a : select.title) !== null && _b !== void 0 ? _b : select.dataset.title) !== null && _c !== void 0 ? _c : '',
            width: '',
            height: '',
            dropdownWidth: '',
            dropdownHeight: '',
            data: new Map(),
            showCheckbox: true,
            translations: {
                selectAll: 'Select all',
                searchPlaceholder: 'Search...',
                selected: '%i selected',
            },
            onInitialize: function () {
            },
            onChange: function () {
            },
            onSelect: function () {
            },
            onUnselect: function () {
            }
        };
        if (!defaults.label) {
            defaults.label = defaults.placeholder;
        }
        this.options = Object.assign(defaults, options);
        for (const prop in this.selectElement.dataset) {
            let dataProp = prop.replace('ms', '');
            dataProp = dataProp[0].toLowerCase() + dataProp.slice(1);
            if ((_d = this.options[dataProp]) !== null && _d !== void 0 ? _d : false) {
                if (dataProp === 'min' || dataProp === 'max') {
                    this.options[dataProp] = parseInt(this.selectElement.dataset[prop]);
                }
                else {
                    this.options[dataProp] = this.selectElement.dataset[prop];
                }
            }
        }
        if (typeof this.options.placeholderType == 'string') {
            this.options.placeholderType = getPlaceholderType(this.options.placeholderType);
        }
        console.log('typeof placeholderType', typeof this.options.placeholderType);
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
                }
                else {
                    if (childNode instanceof HTMLOptionElement) {
                        const defaultOption = this.options.data.get('_default');
                        defaultOption.addValue(new MultiSelectOption(childNode));
                    }
                }
            });
        }
        this.dropdown = this._template();
        // hide the original select element
        (_f = (_e = this.selectElement) === null || _e === void 0 ? void 0 : _e.parentNode) === null || _f === void 0 ? void 0 : _f.insertBefore(this.dropdown, this.selectElement);
        this.dropdown.appendChild(this.selectElement);
        this.selectElement.style.display = 'none';
        this._eventHandlers();
        this.update();
        this.options.onInitialize();
    }
    /**
     * Count the selected options
     */
    countSelectedOptions() {
        return this.getSelectedOptions().length;
    }
    /**
     * Check if the max selection is reached
     */
    maxSelectionReached() {
        return this.options.max && this.countSelectedOptions() >= this.options.max;
    }
    /**
     * Get the translation for a key
     *
     * @param key
     * @protected
     */
    _getTranslation(key) {
        if (!this.options.translations.hasOwnProperty(key)) {
            return key;
        }
        return this.options.translations[key];
    }
    /**
     * Create the template for the dropdown
     * @protected
     */
    _template() {
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
        const defaultGroup = this.options.data.get('_default');
        const defaultGroupHtml = defaultGroup.render(multiSelectOptions, true);
        if (defaultGroupHtml) {
            multiSelectOptions.appendChild(defaultGroupHtml);
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
    _eventHandlers() {
        var _a;
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
                    var _a, _b, _c;
                    let selected = true;
                    if (option.isSelected()) {
                        this.unselectOption(option);
                        selected = false;
                    }
                    else {
                        this.selectOption(option);
                    }
                    if (this.options.search === true) {
                        this.dropdown.querySelector('.multi-select-search').value = '';
                    }
                    if (this.options.closeListOnItemSelect === true) {
                        this.close();
                    }
                    this.options.onChange(optionElement.dataset.value, (_a = optionElement.querySelector('.multi-select-option-text')) === null || _a === void 0 ? void 0 : _a.innerHTML, option);
                    if (selected) {
                        this.options.onSelect(optionElement.dataset.value, (_b = optionElement.querySelector('.multi-select-option-text')) === null || _b === void 0 ? void 0 : _b.innerHTML, option);
                    }
                    else {
                        this.options.onUnselect(optionElement.dataset.value, (_c = optionElement.querySelector('.multi-select-option-text')) === null || _c === void 0 ? void 0 : _c.innerHTML, option);
                    }
                }, { passive: true });
            });
        });
        if (this.options.search) {
            let search = this.dropdown.querySelector('.multi-select-search');
            search.addEventListener('input', () => {
                this.dropdown.querySelectorAll('.multi-select-option').forEach((option) => {
                    var _a;
                    if (option) {
                        option.style.display = ((_a = option.querySelector('.multi-select-option-text')) === null || _a === void 0 ? void 0 : _a.innerHTML.toLowerCase().indexOf(search.value.toLowerCase())) > -1 ? 'flex' : 'none';
                    }
                });
            });
        }
        if (this.options.selectAll) {
            let selectAllButton = this.dropdown.querySelector('.multi-select-all');
            selectAllButton === null || selectAllButton === void 0 ? void 0 : selectAllButton.addEventListener('click', () => {
                let allSelected = selectAllButton.classList.contains('multi-select-selected');
                if (allSelected) {
                    this.unselectAll();
                }
                else {
                    this.selectAll();
                }
            });
        }
        if (this.selectElement.id && document.querySelector('label[for="' + this.selectElement.id + '"]')) {
            (_a = document.querySelector('label[for="' + this.selectElement.id + '"]')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                this.toggle();
            });
        }
        document.addEventListener('click', (e) => {
            const target = e.target;
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
    }
    /**
     * Open the dropdown
     */
    open() {
        var _a;
        (_a = this.dropdown.querySelector('.multi-select-header')) === null || _a === void 0 ? void 0 : _a.classList.add('multi-select-header-active');
    }
    /**
     * Close the dropdown
     */
    close() {
        var _a;
        (_a = this.dropdown.querySelector('.multi-select-header')) === null || _a === void 0 ? void 0 : _a.classList.remove('multi-select-header-active');
    }
    /**
     * Toggle the dropdown
     */
    toggle() {
        var _a;
        (_a = this.dropdown.querySelector('.multi-select-header')) === null || _a === void 0 ? void 0 : _a.classList.toggle('multi-select-header-active');
    }
    /**
     * select an option
     *
     * @param option
     * @param preventUpdate
     */
    selectOption(option, preventUpdate = false) {
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
    unselectOption(option, preventUpdate = false) {
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
    selectAll() {
        this.options.data.forEach((group) => {
            group.getValues().forEach((option) => {
                this.selectOption(option, true);
            });
        });
        this.update();
    }
    /**
     * deselect all options
     */
    unselectAll() {
        this.options.data.forEach((group) => {
            group.getValues().forEach((option) => {
                this.unselectOption(option, true);
            });
        });
        this.update();
    }
    /**
     * update the dropdown and the select element
     */
    update() {
        console.log('update');
        const values = Array.from(this.selectElement.options).map((option) => option.value);
        this.options.data.forEach((group) => {
            group.getValues().filter((option) => values.includes(option.getValue())).map((option) => {
                let optionHtml = this.dropdown.querySelector(`.multi-select-option[data-value="${option.getValue()}"]`);
                if (optionHtml) {
                    if (option.isSelected()) {
                        optionHtml.classList.add('multi-select-selected');
                    }
                    else {
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
                }
                else {
                    selectAllButton.classList.remove('multi-select-selected');
                }
            }
        }
        this.updatePlaceholder();
    }
    /**
     * Update the placeholder in the header
     */
    updatePlaceholder() {
        var _a, _b, _c, _d;
        const headerElement = this.dropdown.querySelector('.multi-select-header');
        (_a = this.dropdown.querySelector('.multi-select-header-placeholder')) === null || _a === void 0 ? void 0 : _a.remove();
        if (this.options.showMaxHint && this.options.max) {
            const headerMax = this.dropdown.querySelector('.multi-select-header-max');
            if (headerMax) {
                headerMax.innerHTML = this.countSelectedOptions() + '/' + ((_b = this.options) === null || _b === void 0 ? void 0 : _b.max);
            }
        }
        if (this.countSelectedOptions() === 0) {
            this.dropdown.querySelectorAll('.multi-select-header-option').forEach((option) => option.remove());
            headerElement === null || headerElement === void 0 ? void 0 : headerElement.insertAdjacentHTML('afterbegin', `<span class="multi-select-header-placeholder">${this.options.placeholder}</span>`);
            console.log('countSelectedOptions');
            return;
        }
        console.log('this.options.placeholderType', this.options.placeholderType);
        switch (this.options.placeholderType) {
            case MultiSelectPlaceholderTypeEnum.count:
                (_c = this.dropdown.querySelector('.multi-select-header-option')) === null || _c === void 0 ? void 0 : _c.remove();
                console.log('placeholderType count');
                const label = this._getTranslation('selected')
                    .replace('%i', this.countSelectedOptions().toString());
                headerElement === null || headerElement === void 0 ? void 0 : headerElement.insertAdjacentHTML('afterbegin', `<span class="multi-select-header-option">${label}</span>`);
                break;
            case MultiSelectPlaceholderTypeEnum.static:
                console.log('placeholderType static');
                (_d = this.dropdown.querySelector('.multi-select-header-option')) === null || _d === void 0 ? void 0 : _d.remove();
                headerElement === null || headerElement === void 0 ? void 0 : headerElement.insertAdjacentHTML('afterbegin', `<span class="multi-select-header-option">${this.options.label}</span>`);
                break;
            case MultiSelectPlaceholderTypeEnum.default:
            default:
                console.log('placeholderType default');
                this.options.data.forEach((group) => {
                    group.getValues().forEach((option) => {
                        var _a;
                        const headerOption = this.dropdown.querySelector(`.multi-select-header-option[data-value="${option.getValue()}"]`);
                        if (!option.isSelected()) {
                            headerOption === null || headerOption === void 0 ? void 0 : headerOption.remove();
                            return;
                        }
                        if (headerOption) {
                            return;
                        }
                        const label = (_a = this.dropdown.querySelector(`.multi-select-option[data-value="${option.getValue()}"] .multi-select-option-text`)) === null || _a === void 0 ? void 0 : _a.innerHTML;
                        const opt = document.createElement('div');
                        opt.classList.add('multi-select-header-option');
                        opt.dataset.value = option.getValue();
                        opt.innerHTML = label;
                        const maxHint = this.dropdown.querySelector('.multi-select-header-max');
                        if (maxHint) {
                            maxHint.insertAdjacentElement('beforebegin', opt);
                        }
                        else {
                            headerElement === null || headerElement === void 0 ? void 0 : headerElement.appendChild(opt);
                        }
                    });
                });
                break;
        }
    }
    /**
     * Reset the selection to the default values
     */
    reset() {
        this.options.data.forEach((group) => {
            group.getValues().forEach((option) => {
                if (option.isDefaultValue()) {
                    this.selectOption(option, true);
                }
                else {
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
    generateRandomString(length) {
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
    escapeCssSelector(selector) {
        return selector.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
    }
    getOptions() {
        return this.options;
    }
}
//# sourceMappingURL=MultiSelect.js.map