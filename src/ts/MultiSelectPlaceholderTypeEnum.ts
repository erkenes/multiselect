export enum MultiSelectPlaceholderTypeEnum {
    default = 'default',
    count = 'count',
    static = 'static',
}

export function getPlaceholderType(type: string) {
    switch (type) {
        case 'count':
            return MultiSelectPlaceholderTypeEnum.count;
        case 'static':
            return MultiSelectPlaceholderTypeEnum.static;
    }

    return MultiSelectPlaceholderTypeEnum.default;
}
