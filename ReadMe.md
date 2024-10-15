# MultiSelect

MultiSelect written in TypeScript.

## Usage

```js
import { MultiSelect } from '@erkenes/multiselect/multiselect';

const select = document.querySelector('select');
const multiselect = new MultiSelect(select);
```

## Options

| Name                  | Type           | Default          | Description                                                                                     |
|-----------------------|----------------|------------------|-------------------------------------------------------------------------------------------------|
| placeholder           | string         | Select item(s)   | The placeholder that is shown if no option is selected                                          |
| max                   | number         | null             | Limits the selection. If the select does not have the attribute `multiple` then the value is 1. |
| min                   | number         | null             | Minimum options that have to be selected.                                                       |
| placeholderType       | string         | default          | `default`: Show all selected values in the header. `count`: Show the amount of selected values. |
| showMaxHint           | boolean        | false            | Show a hint in the header how many items can be selected.                                       |
| search                | boolean        | true             | Show a search field to filter the values                                                        |
| selectAll             | boolean        | false            | Show a button to de-/select all values. (`max` must be greater than 1 or null)                  |
| closeListOnItemSelect | boolean        | false            | Close the dropdown if a item is selected                                                        |
| name                  | string         | null             | (optional) The name of the dropdown. The name-attribute of the Select-Element is selected.      |
| width                 | number\|string | null             | (optional) force the width of the header                                                        |
| height                | number\|string | null             | (optional) force the height of the header                                                       |
| dropdownWidth         | number\|string | null             | (optional) force the width of the dropdown                                                      |
| dropdownHeight        | number\|string | null             | (optional) force the height of the dropdown                                                     |
| data                  | Array          | []               | (optional) The options. The options will be read from the Select-Element                        |
| translations          | JSON           | see Translations | (optional) Overwrite the labels                                                                 |

### Translations

```json5
{
  translations: {
    selectAll: 'Select all',
    searchPlaceholder: 'Search...',
    selected: '%i selected',
  }
}
```
