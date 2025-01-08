export class MultiSelectOption {
    constructor(element, label = undefined, value = undefined, html = undefined, defaultValue = undefined) {
        var _a, _b;
        if (label === undefined) {
            label = (_a = element.label) !== null && _a !== void 0 ? _a : element.innerText;
        }
        if (value === undefined) {
            value = element.value;
        }
        if (html === undefined) {
            html = (_b = element.dataset.msHtml) !== null && _b !== void 0 ? _b : null;
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
    getElement() {
        return this.element;
    }
    getLabel() {
        return this.label;
    }
    getValue() {
        return this.value;
    }
    isSelected() {
        return this.element.selected;
    }
    select() {
        this.element.selected = true;
    }
    unselect() {
        this.element.selected = false;
    }
    isDefaultValue() {
        return this.defaultValue;
    }
    getHtml() {
        return this.html;
    }
    render(group, updateRenderedElement = false) {
        const option = document.createElement('div');
        option.classList.add('multi-select-option');
        if (this.isSelected()) {
            option.classList.add('multi-select-selected');
        }
        option.dataset.value = this.getValue();
        option.innerHTML = `
                <span class="multi-select-option-radio"></span>
                <span class="multi-select-option-text">${this.getHtml() ? this.getHtml() : (this.getLabel() ? this.getLabel() : this.getValue())}</span>
            `;
        if (updateRenderedElement) {
            this.renderedElement = option;
        }
        return option;
    }
    getRenderedElement() {
        return this.renderedElement;
    }
}
//# sourceMappingURL=MultiSelectOption.js.map