# MultiSelect

MultiSelect written in TypeScript.

## Usage

Include the JS file:

```js
import { MultiSelect } from '@erkenes/multiselect';

const select = document.querySelector('select');

// the options are optional
const multiselect = new MultiSelect(select, {
    translations: {
    selectAll: 'Select all',
    searchPlaceholder: 'Search...',
    selected: '%i selected',
  }
});
```

Include the scss file (or use the created dist file):

```scss
@import '@erkenes/multiselect/src/styles/multiselect';
```

## Options

| Name                  | Type           | Default          | Description                                                                                               |
|-----------------------|----------------|------------------|-----------------------------------------------------------------------------------------------------------|
| placeholder           | string         | Select item(s)   | The placeholder that is shown if no option is selected                                                    |
| max                   | number         | null             | Limits the selection. If the select does not have the attribute `multiple` then the value is 1.           |
| min                   | number         | null             | Minimum options that have to be selected.                                                                 |
| placeholderType       | string         | default          | `default`: Show all selected values in the header. `count`: Show the amount of selected values.           |
| showMaxHint           | boolean        | false            | Show a hint in the header how many items can be selected.                                                 |
| search                | boolean        | if options > 6   | Show a search field to filter the values. If the count of options is > 6 the search is shown              |
| selectAll             | boolean        | false            | Show a button to de-/select all values. (`max` must be greater than 1 or null)                            |
| closeListOnItemSelect | boolean        | if multiple      | Close the dropdown if a item is selected. If the select has the attribute `multiple` the values is false  |
| showCheckbox          | boolean        | true             | Show the checkboxed next to the input text                                                                |
| name                  | string         | null             | (optional) The name of the dropdown. The name-attribute of the Select-Element is selected.                |
| width                 | number\|string | null             | (optional) force the width of the header                                                                  |
| height                | number\|string | null             | (optional) force the height of the header                                                                 |
| dropdownWidth         | number\|string | null             | (optional) force the width of the dropdown                                                                |
| dropdownHeight        | number\|string | null             | (optional) force the height of the dropdown                                                               |
| data                  | Array          | []               | (optional) The options. The options will be read from the Select-Element                                  |
| translations          | JSON           | see Translations | (optional) Overwrite the labels                                                                           |

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
