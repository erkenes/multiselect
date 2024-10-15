import { MultiSelectData } from "./MultiSelectData";
export interface MultiSelectOptions {
    placeholder: string;
    max: number | null;
    min: number | null;
    showMaxHint: boolean;
    search: boolean;
    selectAll: boolean;
    placeholderType: string;
    closeListOnItemSelect: boolean;
    name: string;
    width: number | string;
    height: number | string;
    dropdownWidth: number | string;
    dropdownHeight: number | string;
    data: MultiSelectData[];
    onChange: Function;
    onSelect: Function;
    onUnselect: Function;
    translations: {
        selectAll: string;
        searchPlaceholder: string;
    };
}
