import {MultiSelectGroup} from "./MultiSelectGroup";
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
    onInitialize: Function,
    onChange: Function,
    onSelect: Function,
    onUnselect: Function,
    showCheckbox: boolean,
    translations: {
        selectAll: string,
        searchPlaceholder: string,
    }
}
