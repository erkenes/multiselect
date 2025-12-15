import { MultiSelect } from "./MultiSelect";
import {MultiSelectGroup} from "./MultiSelectGroup";
import { MultiSelectOptionI } from "./MultiSelectOption";
import {MultiSelectPlaceholderTypeEnum} from "./MultiSelectPlaceholderTypeEnum";

export interface MultiSelectOptions {
    placeholder: string,
    max: number|null,
    min: number|null,
    showMaxHint: boolean,
    search: boolean,
    selectAll: boolean,
    placeholderType: MultiSelectPlaceholderTypeEnum|string,
    closeListOnItemSelect: boolean,
    name: string,
    label: string,
    width: number|string,
    height: number|string,
    dropdownWidth: number|string,
    dropdownHeight: number|string,
    data: Map<string, MultiSelectGroup>,
    onInitialize: (multiselect: MultiSelect) => void,
    onChange: (value: string, label: string, option: MultiSelectOptionI, multiselect: MultiSelect) => void,
    onSelect: (value: string, label: string, option: MultiSelectOptionI, multiselect: MultiSelect) => void,
    onUnselect: (value: string, label: string, option: MultiSelectOptionI, multiselect: MultiSelect) => void,
    showCheckbox: boolean,
    translations: {
        selectAll: string,
        searchPlaceholder: string,
    }
}
