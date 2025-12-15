export var MultiSelectPlaceholderTypeEnum;
(function (MultiSelectPlaceholderTypeEnum) {
    MultiSelectPlaceholderTypeEnum["default"] = "default";
    MultiSelectPlaceholderTypeEnum["count"] = "count";
    MultiSelectPlaceholderTypeEnum["static"] = "static";
})(MultiSelectPlaceholderTypeEnum || (MultiSelectPlaceholderTypeEnum = {}));
export function getPlaceholderType(type) {
    switch (type) {
        case 'count':
            return MultiSelectPlaceholderTypeEnum.count;
        case 'static':
            return MultiSelectPlaceholderTypeEnum.static;
    }
    return MultiSelectPlaceholderTypeEnum.default;
}
//# sourceMappingURL=MultiSelectPlaceholderTypeEnum.js.map