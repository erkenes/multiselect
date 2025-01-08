import { MultiSelectOption } from "./MultiSelectOption";
export class MultiSelectGroup {
    constructor(element, label = undefined, values = undefined, html = undefined) {
        var _a, _b;
        this.values = [];
        this.element = null;
        if (html === undefined) {
            html = (_a = element === null || element === void 0 ? void 0 : element.dataset.msHtml) !== null && _a !== void 0 ? _a : null;
        }
        if (label === undefined) {
            label = (_b = element === null || element === void 0 ? void 0 : element.getAttribute('label')) !== null && _b !== void 0 ? _b : '';
        }
        this.element = element;
        this.label = label;
        this.html = html;
        if (values === undefined && element) {
            values = this.getOptions();
        }
        this.values = values !== null && values !== void 0 ? values : [];
    }
    getLabel() {
        return this.label;
    }
    getValues() {
        return this.values;
    }
    addValue(value) {
        this.values.push(value);
    }
    removeValue(value) {
        const index = this.values.indexOf(value);
        if (index > -1) {
            this.values.splice(index, 1);
        }
    }
    getHtml() {
        return this.html;
    }
    getElement() {
        return this.element;
    }
    getOptions() {
        var _a;
        const options = Array.from((_a = this.element) === null || _a === void 0 ? void 0 : _a.childNodes).filter((node) => {
            return node instanceof HTMLOptionElement;
        });
        return options === null || options === void 0 ? void 0 : options.map((option) => {
            return new MultiSelectOption(option);
        });
    }
    render(baseElement, updateRenderedElement = false) {
        if (!this.getValues().length) {
            return null;
        }
        const groupElement = document.createElement('div');
        groupElement.classList.add('multi-select-group');
        const groupLabel = document.createElement('div');
        groupLabel.classList.add('multi-select-group-label');
        groupLabel.innerHTML = this.getLabel();
        groupElement.appendChild(groupLabel);
        const groupOptions = document.createElement('div');
        groupOptions.classList.add('multi-select-group-options');
        groupElement.appendChild(groupOptions);
        this.getValues().forEach((option) => {
            groupOptions.appendChild(option.render(this, true));
        });
        const divider = document.createElement('div');
        divider.classList.add('multi-select-divider');
        groupElement.appendChild(divider);
        if (updateRenderedElement) {
            this.renderedElement = groupElement;
        }
        return groupElement;
    }
    getRenderedElement() {
        return this.renderedElement;
    }
}
//# sourceMappingURL=MultiSelectGroup.js.map