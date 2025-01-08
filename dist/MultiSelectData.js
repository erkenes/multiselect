export var MultiSelectDataTypeEnum;
(function (MultiSelectDataTypeEnum) {
    MultiSelectDataTypeEnum["DEFAULT"] = "default";
    MultiSelectDataTypeEnum["GROUP"] = "group";
})(MultiSelectDataTypeEnum || (MultiSelectDataTypeEnum = {}));
class MultiSelectDataAbstract {
    constructor() {
        this.type = MultiSelectDataTypeEnum.DEFAULT;
        this.value = '';
        this.selected = false;
        this.html = null;
        this.isDefaultValue = false;
    }
    getType() {
        return this.type;
    }
    getValue() {
        return this.value;
    }
    getText() {
        return this.text;
    }
    isSelected() {
        return this.selected;
    }
    getHtml() {
        return this.html;
    }
    isADefaultValue() {
        return this.isDefaultValue;
    }
}
export class MultiSelectOption extends MultiSelectDataAbstract {
    constructor(value, text, selected, html, isDefaultValue) {
        super();
        this.value = value;
        this.text = text;
        this.selected = selected;
        this.html = html;
        this.isDefaultValue = isDefaultValue;
    }
    setDefaultValue(isDefaultValue) {
        this.isDefaultValue = isDefaultValue;
    }
}
export class MultiSelectGroup extends MultiSelectDataAbstract {
    constructor(value, text, html) {
        super();
        this.type = MultiSelectDataTypeEnum.GROUP;
        this.value = [];
        this.selected = false;
        this.isDefaultValue = false;
        this.value = value;
        this.text = text;
        this.html = html;
    }
}
//# sourceMappingURL=MultiSelectData.js.map