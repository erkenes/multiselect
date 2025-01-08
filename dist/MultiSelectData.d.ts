export declare enum MultiSelectDataTypeEnum {
    DEFAULT = "default",
    GROUP = "group"
}
export interface MultiSelectData {
    type: MultiSelectDataTypeEnum;
    value: string | MultiSelectData[];
    text: string;
    selected: boolean;
    html: string | null;
    isDefaultValue: boolean;
    getType(): MultiSelectDataTypeEnum;
    getValue(): string | MultiSelectData[];
    getText(): string;
    isSelected(): boolean;
    getHtml(): string | null;
    isADefaultValue(): boolean;
}
declare abstract class MultiSelectDataAbstract implements MultiSelectData {
    type: MultiSelectDataTypeEnum;
    value: string | MultiSelectData[];
    text: string;
    selected: boolean;
    html: string | null;
    isDefaultValue: boolean;
    getType(): MultiSelectDataTypeEnum;
    getValue(): string | MultiSelectData[];
    getText(): string;
    isSelected(): boolean;
    getHtml(): string | null;
    isADefaultValue(): boolean;
}
export declare class MultiSelectOption extends MultiSelectDataAbstract {
    constructor(value: string, text: string, selected: boolean, html: string | null, isDefaultValue: boolean);
    setDefaultValue(isDefaultValue: boolean): void;
}
export declare class MultiSelectGroup extends MultiSelectDataAbstract {
    type: MultiSelectDataTypeEnum;
    value: MultiSelectData[];
    readonly selected: boolean;
    readonly isDefaultValue: boolean;
    constructor(value: MultiSelectData[], text: string, html: string | null);
}
export {};
