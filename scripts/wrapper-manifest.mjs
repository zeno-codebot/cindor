const slots = {
  all: "all",
  default: "default",
  none: "none"
};

const bool = (name, defaultValue = false, options = {}) => ({
  attr: options.attr ?? name,
  defaultValue,
  kind: "boolean",
  name
});

const str = (name, defaultValue = "", options = {}) => ({
  alwaysPass: options.alwaysPass ?? false,
  attr: options.attr ?? name,
  defaultValue,
  forceProperty: options.forceProperty ?? false,
  kind: "string",
  name
});

const num = (name, defaultValue, options = {}) => ({
  attr: options.attr ?? name,
  defaultValue,
  forceProperty: options.forceProperty ?? false,
  kind: "number",
  name
});

const typed = (name, typeExpression, defaultValue, options = {}) => ({
  alwaysPass: options.alwaysPass ?? true,
  attr: options.attr ?? name,
  defaultValue,
  forceProperty: options.forceProperty ?? false,
  kind: "typed-string",
  name,
  typeExpression
});

const arr = (name, typeExpression, options = {}) => ({
  attr: options.attr ?? name,
  defaultFactory: options.defaultFactory ?? "() => []",
  forceProperty: options.forceProperty ?? true,
  kind: "array",
  name,
  typeExpression
});

const obj = (name, typeExpression, options = {}) => ({
  attr: options.attr ?? name,
  defaultFactory: options.defaultFactory ?? "() => ({})",
  forceProperty: options.forceProperty ?? true,
  kind: "object",
  name,
  typeExpression
});

const func = (name, typeExpression, options = {}) => ({
  attr: options.attr ?? name,
  forceProperty: options.forceProperty ?? true,
  kind: "function",
  name,
  typeExpression
});

const handler = (domEvent, options = {}) => ({
  domEvent,
  emitName: Object.prototype.hasOwnProperty.call(options, "emitName") ? options.emitName : domEvent,
  modelEmit: options.modelEmit,
  modelHostProperty: options.modelHostProperty,
  modelHostType: options.modelHostType,
  modelValueExpression: options.modelValueExpression
});

const component = (exportName, tagName, options = {}) => ({
  exportName,
  reactEvents: options.reactEvents,
  slots: options.slots ?? slots.none,
  tagName,
  vueDebugEmptyStateSignal: options.vueDebugEmptyStateSignal ?? false,
  vueHandlers: options.vueHandlers ?? [],
  vueProps: options.vueProps ?? []
});

const inputStringProps = (options = {}) => [
  str("autocomplete", options.autocompleteDefault ?? "", { alwaysPass: Boolean(options.autocompleteDefault) }),
  bool("disabled"),
  str("modelValue", options.modelDefault ?? "", { attr: "value", alwaysPass: true }),
  str("name"),
  ...(options.includeIcons
    ? [
        str("startIcon", options.startIconDefault ?? "", { attr: "start-icon", alwaysPass: Boolean(options.startIconDefault) }),
        str("endIcon", options.endIconDefault ?? "", { attr: "end-icon", alwaysPass: Boolean(options.endIconDefault) })
      ]
    : []),
  str("placeholder"),
  bool("readonly"),
  bool("required")
];

const currentOpen = handler("toggle", {
  emitName: "toggle",
  modelEmit: "update:open",
  modelHostProperty: "open",
  modelHostType: "OpenHost"
});

const textModelHandlers = [
  handler("input", {
    emitName: "input",
    modelEmit: "update:modelValue",
    modelHostProperty: "value",
    modelHostType: "InputHost"
  }),
  handler("change", {
    emitName: "change",
    modelEmit: "update:modelValue",
    modelHostProperty: "value",
    modelHostType: "InputHost"
  })
];

const numberModelHandlers = [
  handler("input", {
    emitName: "input",
    modelEmit: "update:modelValue",
    modelHostProperty: "value",
    modelHostType: "InputHost",
    modelValueExpression: "Number(target.value)"
  }),
  handler("change", {
    emitName: "change",
    modelEmit: "update:modelValue",
    modelHostProperty: "value",
    modelHostType: "InputHost",
    modelValueExpression: "Number(target.value)"
  })
];

const checkedModelHandlers = [
  handler("input", {
    emitName: "input",
    modelEmit: "update:modelValue",
    modelHostProperty: "checked",
    modelHostType: "CheckboxHost"
  }),
  handler("change", {
    emitName: "change",
    modelEmit: "update:modelValue",
    modelHostProperty: "checked",
    modelHostType: "CheckboxHost"
  })
];

export const componentDefinitions = [
  component("CindorButton", "cindor-button", {
    slots: slots.all,
    vueProps: [bool("disabled"), bool("iconOnly"), typed("type", "ButtonType", "button"), typed("variant", "ButtonVariant", "solid")]
  }),
  component("CindorButtonGroup", "cindor-button-group", {
    slots: slots.default,
    vueProps: [bool("attached"), typed("orientation", "ButtonGroupOrientation", "horizontal")]
  }),
  component("CindorSplitButton", "cindor-split-button", {
    slots: slots.all,
    vueHandlers: [currentOpen],
    vueProps: [
      bool("disabled"),
      str("menuLabel", "More actions", { attr: "menu-label", alwaysPass: true }),
      bool("open"),
      typed("type", "ButtonType", "button"),
      typed("variant", "ButtonVariant", "solid")
    ]
  }),
  component("CindorChip", "cindor-chip", {
    slots: slots.default,
    vueProps: [typed("tone", "ChipTone", "neutral")]
  }),
  component("CindorTag", "cindor-tag", {
    slots: slots.default,
    vueHandlers: [handler("remove")],
    vueProps: [bool("dismissible"), str("removeLabel", "Remove tag", { attr: "remove-label", alwaysPass: true }), typed("tone", "TagTone", "accent")]
  }),
  component("CindorIconButton", "cindor-icon-button", {
    vueProps: [
      bool("disabled"),
      str("label"),
      typed("name", "LucideIconName | string", ""),
      num("size", 16),
      num("strokeWidth", 2, { attr: "stroke-width" }),
      typed("type", "ButtonType", "button")
    ]
  }),
  component("CindorCard", "cindor-card", { slots: slots.default }),
  component("CindorCalendar", "cindor-calendar", {
    reactEvents: ["input", "change"],
    vueHandlers: textModelHandlers,
    vueProps: [
      bool("disabled"),
      str("endValue", "", { attr: "end-value" }),
      str("max"),
      str("min"),
      str("month"),
      str("modelValue", "", { attr: "value", alwaysPass: true }),
      str("name"),
      bool("range"),
      bool("required"),
      str("startValue", "", { attr: "start-value" })
    ]
  }),
  component("CindorEventCalendar", "cindor-event-calendar", {
    reactEvents: ["input", "change", "event-select"],
    vueHandlers: [...textModelHandlers, handler("event-select", { emitName: "event-select" })],
    vueProps: [
      str("emptyMessage", "No events scheduled for this day.", { attr: "empty-message", alwaysPass: true }),
      arr("events", "EventCalendarEvent[]"),
      str("month"),
      str("modelValue", "", { attr: "value", alwaysPass: true })
    ]
  }),
  component("CindorDataGrid", "cindor-data-grid", {
    reactEvents: ["active-cell-change", "cell-edit", "sort-change"],
    vueHandlers: [
      handler("active-cell-change"),
      handler("cell-edit"),
      handler("sort-change", {
        emitName: "sort-change",
        modelEmit: "update:sortDirection",
        modelHostProperty: "sortDirection",
        modelHostType: "SortHost"
      }),
      handler("sort-change", {
        emitName: null,
        modelEmit: "update:sortKey",
        modelHostProperty: "sortKey",
        modelHostType: "SortHost"
      })
    ],
    vueProps: [
      arr("columns", "DataGridColumn[]"),
      str("emptyMessage", "No rows to display.", { attr: "empty-message", alwaysPass: true }),
      str("rowIdKey", "id", { attr: "row-id-key", alwaysPass: true }),
      arr("rows", "DataGridRow[]"),
      typed("sortDirection", "DataGridSortDirection", "ascending", { forceProperty: true }),
      str("sortKey", "", { forceProperty: true })
    ]
  }),
  component("CindorBadge", "cindor-badge", {
    slots: slots.default,
    vueProps: [typed("tone", '"neutral" | "accent" | "success"', "neutral")]
  }),
  component("CindorDivider", "cindor-divider"),
  component("CindorProvider", "cindor-provider", {
    slots: slots.default,
    vueProps: [
      obj("darkThemeTokens", "ProviderThemeTokens"),
      obj("lightThemeTokens", "ProviderThemeTokens"),
      str("primaryColor", "", { attr: "primary-color", alwaysPass: true }),
      obj("themeTokens", "ProviderThemeTokens"),
      typed("themeFamily", "ProviderThemeFamily", "inherit", { attr: "theme-family" }),
      typed("theme", "ProviderTheme", "inherit")
    ]
  }),
  component("CindorSpinner", "cindor-spinner"),
  component("CindorAlert", "cindor-alert", {
    slots: slots.default,
    vueProps: [typed("tone", '"info" | "success" | "warning" | "danger"', "info")]
  }),
  component("CindorBanner", "cindor-banner", {
    reactEvents: ["dismiss", "open-change"],
    slots: slots.all,
    vueHandlers: [
      handler("dismiss"),
      handler("open-change", {
        emitName: "open-change",
        modelEmit: "update:open",
        modelHostProperty: "open",
        modelHostType: "OpenHost",
        modelValueExpression: "Boolean((event as CustomEvent<{ open?: boolean }>).detail?.open)"
      })
    ],
    vueProps: [
      bool("dismissible"),
      bool("open", true),
      typed("roleType", '"status" | "alert"', "", { attr: "role-type", alwaysPass: false }),
      bool("sticky"),
      str("title"),
      typed("tone", '"info" | "success" | "warning" | "danger"', "info")
    ]
  }),
  component("CindorActivityFeed", "cindor-activity-feed", {
    slots: slots.default
  }),
  component("CindorActivityItem", "cindor-activity-item", {
    slots: slots.all,
    vueProps: [bool("unread")]
  }),
  component("CindorAutocomplete", "cindor-autocomplete", {
    reactEvents: ["change", "input", "suggestion-select"],
    vueHandlers: [...textModelHandlers, handler("suggestion-select")],
    vueProps: [
      bool("disabled"),
      str("emptyMessage", "No matching suggestions.", { attr: "empty-message", alwaysPass: true }),
      bool("loading"),
      str("modelValue", "", { attr: "value", alwaysPass: true }),
      str("name"),
      bool("open"),
      str("placeholder"),
      bool("required"),
      arr("suggestions", "AutocompleteSuggestion[]")
    ]
  }),
  component("CindorAvatar", "cindor-avatar", {
    vueProps: [str("alt"), str("name"), str("src")]
  }),
  component("CindorProgress", "cindor-progress", {
    slots: slots.default,
    vueProps: [num("max", 100), num("value", 0)]
  }),
  component("CindorMeter", "cindor-meter", {
    slots: slots.default,
    vueProps: [num("high", 100), num("low", 0), num("max", 100), num("min", 0), num("optimum", 100), num("value", 0)]
  }),
  component("CindorBreadcrumbs", "cindor-breadcrumbs", { slots: slots.default }),
  component("CindorSkeleton", "cindor-skeleton", {
    vueProps: [typed("variant", "SkeletonVariant", "line")]
  }),
  component("CindorStepper", "cindor-stepper", {
    reactEvents: ["change", "input"],
    vueHandlers: textModelHandlers,
    vueProps: [
      bool("disabled"),
      bool("interactive"),
      typed("orientation", "StepperOrientation", "horizontal"),
      arr("steps", "StepperStep[]"),
      str("modelValue", "", { attr: "value", alwaysPass: true })
    ]
  }),
  component("CindorLink", "cindor-link", {
    slots: slots.default,
    vueProps: [str("download"), str("href"), str("rel"), str("target")]
  }),
  component("CindorFieldset", "cindor-fieldset", {
    slots: slots.all,
    vueProps: [bool("disabled"), str("legend")]
  }),
  component("CindorForm", "cindor-form", {
    reactEvents: ["reset", "submit"],
    slots: slots.default,
    vueHandlers: [handler("reset"), handler("submit")],
    vueProps: [str("description"), str("error"), bool("submitting"), str("submittingLabel", "Submitting…", { attr: "submitting-label", alwaysPass: true }), str("success"), bool("validateOnSubmit", true, { attr: "validate-on-submit" })]
  }),
  component("CindorFormField", "cindor-form-field", {
    slots: slots.all,
    vueProps: [str("description"), str("error"), str("label"), bool("required")]
  }),
  component("CindorFormRow", "cindor-form-row", {
    slots: slots.default,
    vueProps: [num("columns", 2)]
  }),
  component("CindorGrid", "cindor-grid", {
    slots: slots.default,
    vueProps: [
      typed("align", "GridAlign", "stretch"),
      num("columns", 2),
      typed("gap", "GridGap", "4"),
      typed("justify", "GridAlign", "stretch"),
      str("minColumnWidth", "", { attr: "min-column-width", alwaysPass: false })
    ]
  }),
  component("CindorHelperText", "cindor-helper-text", { slots: slots.default }),
  component("CindorErrorText", "cindor-error-text", { slots: slots.default }),
  component("CindorRange", "cindor-range", {
    vueHandlers: numberModelHandlers,
    vueProps: [bool("disabled"), num("max", 100), num("min", 0), str("name"), bool("required"), num("step", 1), num("modelValue", 0, { attr: "value" })]
  }),
  component("CindorFileInput", "cindor-file-input", {
    reactEvents: ["input", "change"],
    vueHandlers: [
      handler("input", {
        emitName: "input",
        modelEmit: "update:files",
        modelHostProperty: "files",
        modelHostType: "FileInputHost"
      }),
      handler("change", {
        emitName: "change",
        modelEmit: "update:files",
        modelHostProperty: "files",
        modelHostType: "FileInputHost"
      })
    ],
    vueProps: [str("accept"), bool("disabled"), bool("multiple"), str("name"), bool("required")]
  }),
  component("CindorFieldArray", "cindor-field-array", {
    reactEvents: ["change", "input"],
    vueHandlers: textModelHandlers,
    vueProps: [
      str("addLabel", "Add item", { attr: "add-label", alwaysPass: true }),
      func("createItem", "FieldArrayCreateItem<unknown> | undefined"),
      bool("disabled"),
      str("emptyCopy", "Add the first item to start building this repeated field group.", { attr: "empty-copy", alwaysPass: true }),
      str("emptyTitle", "No items yet", { attr: "empty-title", alwaysPass: true }),
      arr("items", "unknown[]"),
      num("maxItems", 0, { attr: "max-items" }),
      num("minItems", 0, { attr: "min-items" }),
      str("moveDownLabel", "Move item down", { attr: "move-down-label", alwaysPass: true }),
      str("moveUpLabel", "Move item up", { attr: "move-up-label", alwaysPass: true }),
      str("name"),
      str("removeLabel", "Remove item", { attr: "remove-label", alwaysPass: true }),
      func("renderItem", "FieldArrayItemRenderer<unknown> | undefined"),
      str("modelValue", "", { attr: "value", alwaysPass: true })
    ]
  }),
  component("CindorFilterBuilder", "cindor-filter-builder", {
    reactEvents: ["change", "input"],
    vueHandlers: textModelHandlers,
    vueProps: [bool("disabled"), arr("fields", "FilterBuilderField[]"), str("name"), str("modelValue", "", { attr: "value", alwaysPass: true })]
  }),
  component("CindorPagination", "cindor-pagination", {
    reactEvents: ["change"],
    vueHandlers: [
      handler("change", {
        emitName: "change",
        modelEmit: "update:currentPage",
        modelHostProperty: "currentPage",
        modelHostType: "PageHost"
      })
    ],
    vueProps: [num("currentPage", 1), num("maxVisiblePages", 5), num("totalPages", 1)]
  }),
  component("CindorPageHeader", "cindor-page-header", {
    slots: slots.all,
    vueProps: [str("description"), str("eyebrow"), str("title")]
  }),
  component("CindorPanelInspector", "cindor-panel-inspector", {
    slots: slots.all,
    vueProps: [str("description"), bool("sticky"), str("title")]
  }),
  component("CindorDataTable", "cindor-data-table", {
    reactEvents: ["cell-edit", "page-change", "row-action", "row-expand", "search-change", "sort-change"],
    slots: slots.all,
    vueDebugEmptyStateSignal: true,
    vueHandlers: [
      handler("cell-edit"),
      handler("page-change", {
        emitName: "page-change",
        modelEmit: "update:currentPage",
        modelHostProperty: "currentPage",
        modelHostType: "PageHost"
      }),
      handler("row-expand", {
        emitName: "row-expand",
        modelEmit: "update:expandedRowIds",
        modelHostProperty: "expandedRowIds",
        modelHostType: "ExpandedRowsHost"
      }),
      handler("row-action"),
      handler("search-change", {
        emitName: "search-change",
        modelEmit: "update:searchQuery",
        modelHostProperty: "searchQuery",
        modelHostType: "SearchQueryHost"
      }),
      handler("sort-change", {
        emitName: "sort-change",
        modelEmit: "update:sortDirection",
        modelHostProperty: "sortDirection",
        modelHostType: "SortHost"
      }),
      handler("sort-change", {
        emitName: null,
        modelEmit: "update:sortKey",
        modelHostProperty: "sortKey",
        modelHostType: "SortHost"
      })
    ],
    vueProps: [
      str("caption"),
      arr("columns", "DataTableColumn[]"),
      num("currentPage", 1, { forceProperty: true }),
      str("emptyMessage", "No rows to display.", { alwaysPass: true, attr: "empty-message" }),
      bool("expandableRows"),
      arr("expandedRowIds", "string[]"),
      bool("loading"),
      num("pageSize", 10),
      str("rowIdKey", "id", { alwaysPass: true, attr: "row-id-key", forceProperty: true }),
      str("rowExpansionLabel", "Row details", { alwaysPass: true, attr: "row-expansion-label" }),
      str("rowExpansionSlot", "row-expansion", { alwaysPass: true, attr: "row-expansion-slot" }),
      arr("rows", "DataTableRow[]"),
      bool("searchable"),
      str("searchLabel", "Search rows", { alwaysPass: true, attr: "search-label" }),
      str("searchPlaceholder", "Search rows", { alwaysPass: true, attr: "search-placeholder" }),
      str("searchQuery", ""),
      typed("sortDirection", "DataTableSortDirection", "ascending", { attr: "sort-direction", forceProperty: true }),
      str("sortKey", "", { forceProperty: true, attr: "sort-key" })
    ]
  }),
  component("CindorDataViewToolbar", "cindor-data-view-toolbar", {
    slots: slots.all,
    vueProps: [
      str("description"),
      num("itemCount", 0, { attr: "item-count" }),
      str("itemLabel", "items", { attr: "item-label", alwaysPass: true }),
      num("selectionCount", 0, { attr: "selection-count" }),
      str("selectionLabel", "selected", { attr: "selection-label", alwaysPass: true }),
      str("title")
    ]
  }),
  component("CindorEmptyState", "cindor-empty-state", { slots: slots.all }),
  component("CindorEmptySearchResults", "cindor-empty-search-results", {
    slots: slots.all,
    vueProps: [str("description"), str("heading", "No matching results", { alwaysPass: true }), str("query")]
  }),
  component("CindorIcon", "cindor-icon", {
    vueProps: [str("label"), str("name"), num("size", 20), num("strokeWidth", 2)]
  }),
  component("CindorCodeBlock", "cindor-code-block", {
    slots: slots.default,
    vueProps: [str("code"), str("language")]
  }),
  component("CindorCoachmarkTour", "cindor-coachmark-tour", {
    reactEvents: ["close", "complete", "open-change", "step-change"],
    vueHandlers: [
      handler("close"),
      handler("complete"),
      handler("open-change", {
        emitName: "open-change",
        modelEmit: "update:open",
        modelHostProperty: "open",
        modelHostType: "OpenHost"
      }),
      handler("step-change", {
        emitName: "step-change",
        modelEmit: "update:currentStep",
        modelHostProperty: "currentStep",
        modelHostType: "HTMLElement & { currentStep: number }"
      })
    ],
    vueProps: [
      num("currentStep", 0, { attr: "current-step" }),
      str("dismissLabel", "Dismiss", { attr: "dismiss-label", alwaysPass: true }),
      str("finishLabel", "Finish", { attr: "finish-label", alwaysPass: true }),
      str("nextLabel", "Next", { attr: "next-label", alwaysPass: true }),
      bool("open"),
      str("previousLabel", "Back", { attr: "previous-label", alwaysPass: true }),
      arr("steps", "CoachmarkTourStep[]")
    ]
  }),
  component("CindorCommandBar", "cindor-command-bar", {
    slots: slots.all,
    vueProps: [num("count", 0), str("countLabel", "selected", { attr: "count-label", alwaysPass: true }), str("description"), str("label"), bool("sticky")]
  }),
  component("CindorCommandPalette", "cindor-command-palette", {
    reactEvents: ["cancel", "change", "close", "command-select", "input"],
    vueHandlers: [
      handler("input", {
        emitName: "input",
        modelEmit: "update:modelValue",
        modelHostProperty: "value",
        modelHostType: "InputHost"
      }),
      handler("change", {
        emitName: "change",
        modelEmit: "update:modelValue",
        modelHostProperty: "value",
        modelHostType: "InputHost"
      }),
      handler("close", {
        emitName: "close",
        modelEmit: "update:open",
        modelValueExpression: "false"
      }),
      handler("cancel", {
        emitName: "cancel",
        modelEmit: "update:open",
        modelValueExpression: "false"
      }),
      handler("command-select")
    ],
    vueProps: [
      arr("commands", "CommandPaletteCommand[]"),
      str("emptyMessage", "No matching commands.", { attr: "empty-message", alwaysPass: true }),
      str("modelValue", "", { attr: "value", alwaysPass: true }),
      bool("open"),
      str("placeholder", "Search commands", { alwaysPass: true }),
      str("query"),
      str("title", "Command palette", { alwaysPass: true })
    ]
  }),
  component("CindorContextMenu", "cindor-context-menu", {
    slots: slots.all,
    vueHandlers: [currentOpen],
    vueProps: [bool("open")]
  }),
  component("CindorDatePicker", "cindor-date-picker", {
    reactEvents: ["change", "input", "toggle"],
    vueHandlers: [...textModelHandlers, currentOpen],
    vueProps: [
      bool("disabled"),
      str("max"),
      str("min"),
      str("month"),
      str("modelValue", "", { attr: "value", alwaysPass: true }),
      str("name"),
      bool("open"),
      str("placeholder", "Select a date", { alwaysPass: true }),
      bool("required")
    ]
  }),
  component("CindorDateRangePicker", "cindor-date-range-picker", {
    reactEvents: ["change", "input", "toggle"],
    vueHandlers: [handler("input"), handler("change"), currentOpen],
    vueProps: [
      str("endValue", "", { attr: "end-value" }),
      str("max"),
      str("min"),
      str("month"),
      bool("open"),
      str("placeholder", "Select a date range", { alwaysPass: true }),
      str("startValue", "", { attr: "start-value" })
    ]
  }),
  component("CindorDateTimePicker", "cindor-date-time-picker", {
    reactEvents: ["change", "input"],
    vueHandlers: textModelHandlers,
    vueProps: [
      str("dateValue", "", { attr: "date-value" }),
      bool("disabled"),
      str("modelValue", "", { attr: "value", alwaysPass: true }),
      str("name"),
      bool("required"),
      str("timeValue", "", { attr: "time-value" })
    ]
  }),
  component("CindorListbox", "cindor-listbox", {
    slots: slots.default,
    vueProps: [num("activeIndex", -1), bool("multiselectable"), str("selectedValue")]
  }),
  component("CindorDescriptionItem", "cindor-description-item", {
    slots: slots.all
  }),
  component("CindorDescriptionList", "cindor-description-list", {
    slots: slots.default
  }),
  component("CindorMenu", "cindor-menu", { slots: slots.default }),
  component("CindorMenuItem", "cindor-menu-item", {
    slots: slots.default,
    vueProps: [bool("disabled")]
  }),
  component("CindorMultiSelect", "cindor-multi-select", {
    slots: slots.default,
    reactEvents: ["change", "input"],
    vueHandlers: [
      handler("input", {
        emitName: "input",
        modelEmit: "update:modelValue",
        modelHostProperty: "values",
        modelHostType: "HTMLElement & { values: string[] }"
      }),
      handler("change", {
        emitName: "change",
        modelEmit: "update:modelValue",
        modelHostProperty: "values",
        modelHostType: "HTMLElement & { values: string[] }"
      })
    ],
    vueProps: [bool("disabled"), str("name"), bool("open"), str("placeholder", "Select options", { alwaysPass: true }), bool("required"), arr("modelValue", "string[]", { attr: "values" })]
  }),
  component("CindorNotificationCenter", "cindor-notification-center", {
    slots: slots.all,
    vueProps: [
      str("description"),
      str("emptyHeadline", "No notifications", { attr: "empty-headline", alwaysPass: true }),
      str("emptyMessage", "You're all caught up. Durable updates will appear here.", { attr: "empty-message", alwaysPass: true }),
      num("headingLevel", 2, { attr: "heading-level" }),
      num("totalCount", null, { attr: "total-count" }),
      num("unreadCount", null, { attr: "unread-count" }),
      str("eyebrow"),
      str("title")
    ]
  }),
  component("CindorTagInput", "cindor-tag-input", {
    reactEvents: ["change", "input"],
    vueHandlers: [
      handler("input", {
        emitName: "input",
        modelEmit: "update:modelValue",
        modelHostProperty: "values",
        modelHostType: "HTMLElement & { values: string[] }"
      }),
      handler("change", {
        emitName: "change",
        modelEmit: "update:modelValue",
        modelHostProperty: "values",
        modelHostType: "HTMLElement & { values: string[] }"
      })
    ],
    vueProps: [
      bool("disabled"),
      str("name"),
      str("placeholder", "Add a tag", { alwaysPass: true }),
      bool("required"),
      arr("modelValue", "string[]", { attr: "values" })
    ]
  }),
  component("CindorNumberInput", "cindor-number-input", {
    vueHandlers: textModelHandlers,
    vueProps: [
      bool("disabled"),
      str("modelValue", "", { attr: "value", alwaysPass: true }),
      str("name"),
      str("startIcon", "", { attr: "start-icon" }),
      str("endIcon", "", { attr: "end-icon" }),
      str("placeholder"),
      bool("readonly"),
      bool("required"),
      str("max"),
      str("min"),
      str("step")
    ]
  }),
  component("CindorSearch", "cindor-search", {
    vueHandlers: textModelHandlers,
    vueProps: inputStringProps({ includeIcons: true, startIconDefault: "search" }),
    reactEvents: ["change", "input"]
  }),
  component("CindorSplitter", "cindor-splitter", {
    slots: slots.default,
    reactEvents: ["panel-resize"],
    vueHandlers: [handler("panel-resize")],
    vueProps: [typed("orientation", "SplitterOrientation", "horizontal")]
  }),
  component("CindorSplitterPanel", "cindor-splitter-panel", {
    slots: slots.default,
    vueProps: [num("minSize", 10, { attr: "min-size" }), num("size", 0)]
  }),
  component("CindorSegmentedControl", "cindor-segmented-control", {
    slots: slots.none,
    vueHandlers: textModelHandlers,
    vueProps: [bool("disabled"), str("modelValue", "", { attr: "value", alwaysPass: true }), str("name"), arr("options", "SegmentedControlOption[]"), bool("required")]
  }),
  component("CindorCombobox", "cindor-combobox", {
    slots: slots.default,
    vueHandlers: textModelHandlers,
    vueProps: inputStringProps()
  }),
  component("CindorDateInput", "cindor-date-input", {
    vueHandlers: textModelHandlers,
    vueProps: [
      bool("disabled"),
      str("max"),
      str("min"),
      str("modelValue", "", { attr: "value", alwaysPass: true }),
      str("name"),
      str("startIcon", "", { attr: "start-icon" }),
      str("endIcon", "", { attr: "end-icon" }),
      bool("readonly"),
      bool("required")
    ]
  }),
  component("CindorTimeInput", "cindor-time-input", {
    vueHandlers: textModelHandlers,
    vueProps: [
      bool("disabled"),
      str("max"),
      str("min"),
      str("modelValue", "", { attr: "value", alwaysPass: true }),
      str("name"),
      str("startIcon", "", { attr: "start-icon" }),
      str("endIcon", "", { attr: "end-icon" }),
      bool("readonly"),
      bool("required"),
      str("step")
    ]
  }),
  component("CindorRatingInput", "cindor-rating-input", {
    vueHandlers: numberModelHandlers,
    vueProps: [bool("clearable"), bool("disabled"), num("max", 5), num("modelValue", 0, { attr: "value" }), str("name"), bool("required")]
  }),
  component("CindorToast", "cindor-toast", {
    slots: slots.default,
    vueHandlers: [
      handler("close", {
        emitName: "close",
        modelEmit: "update:open",
        modelValueExpression: "false"
      })
    ],
    vueProps: [bool("dismissible"), bool("open", true), typed("tone", '"neutral" | "success" | "warning" | "danger"', "neutral")]
  }),
  component("CindorToastRegion", "cindor-toast-region", {
    slots: slots.all,
    vueHandlers: [handler("toast-show"), handler("toast-remove")],
    vueProps: [num("maxVisible", 5), typed("placement", "ToastPlacement", "top-end")]
  }),
  component("CindorTooltip", "cindor-tooltip", {
    slots: slots.default,
    vueProps: [bool("open"), str("text")]
  }),
  component("CindorToolbar", "cindor-toolbar", {
    slots: slots.default,
    vueProps: [typed("orientation", "ToolbarOrientation", "horizontal"), bool("wrap")]
  }),
  component("CindorPopover", "cindor-popover", {
    slots: slots.default,
    vueHandlers: [currentOpen],
    vueProps: [bool("open")]
  }),
  component("CindorDropdownMenu", "cindor-dropdown-menu", {
    slots: slots.default,
    vueHandlers: [currentOpen],
    vueProps: [bool("open")]
  }),
  component("CindorDropzone", "cindor-dropzone", {
    reactEvents: ["input", "change"],
    vueHandlers: [
      handler("input", {
        emitName: "input",
        modelEmit: "update:files",
        modelHostProperty: "files",
        modelHostType: "FileInputHost"
      }),
      handler("change", {
        emitName: "change",
        modelEmit: "update:files",
        modelHostProperty: "files",
        modelHostType: "FileInputHost"
      })
    ],
    vueProps: [str("accept"), bool("disabled"), bool("multiple"), str("name"), bool("required")]
  }),
  component("CindorDrawer", "cindor-drawer", {
    slots: slots.default,
    vueHandlers: [
      handler("close", {
        emitName: "close",
        modelEmit: "update:open",
        modelValueExpression: "false"
      })
    ],
    vueProps: [bool("open"), typed("side", '"start" | "end"', "end")]
  }),
  component("CindorInput", "cindor-input", {
    vueHandlers: textModelHandlers,
    vueProps: [...inputStringProps({ includeIcons: true }), str("type", "text", { alwaysPass: true })]
  }),
  component("CindorInlineEdit", "cindor-inline-edit", {
    reactEvents: ["cancel", "change", "input", "toggle"],
    vueHandlers: [
      ...textModelHandlers,
      handler("cancel"),
      handler("toggle", {
        emitName: "toggle",
        modelEmit: "update:editing",
        modelHostProperty: "editing",
        modelHostType: "HTMLElement & { editing: boolean }"
      })
    ],
    vueProps: [bool("disabled"), bool("editing"), str("modelValue", "", { attr: "value", alwaysPass: true }), str("placeholder", "Click edit", { alwaysPass: true })]
  }),
  component("CindorLayout", "cindor-layout", {
    slots: slots.default
  }),
  component("CindorLayoutContent", "cindor-layout-content", {
    slots: slots.default
  }),
  component("CindorLayoutHeader", "cindor-layout-header", {
    slots: slots.default
  }),
  component("CindorEmailInput", "cindor-email-input", {
    vueHandlers: textModelHandlers,
    vueProps: inputStringProps({ autocompleteDefault: "email", includeIcons: true })
  }),
  component("CindorPasswordInput", "cindor-password-input", {
    vueHandlers: textModelHandlers,
    vueProps: inputStringProps({ autocompleteDefault: "current-password" })
  }),
  component("CindorOption", "cindor-option", {
    slots: slots.default,
    vueProps: [bool("active"), bool("disabled"), str("label"), bool("selected"), str("value")]
  }),
  component("CindorMenubar", "cindor-menubar", {
    slots: slots.default
  }),
  component("CindorNavigationRail", "cindor-navigation-rail", {
    slots: slots.default
  }),
  component("CindorNavigationRailItem", "cindor-navigation-rail-item", {
    slots: slots.all,
    vueProps: [bool("current"), bool("disabled"), str("href"), str("label"), str("rel"), str("target"), str("value")]
  }),
  component("CindorTelInput", "cindor-tel-input", {
    vueHandlers: textModelHandlers,
    vueProps: inputStringProps({ autocompleteDefault: "tel", includeIcons: true })
  }),
  component("CindorUrlInput", "cindor-url-input", {
    vueHandlers: textModelHandlers,
    vueProps: inputStringProps({ autocompleteDefault: "url", includeIcons: true })
  }),
  component("CindorColorInput", "cindor-color-input", {
    vueHandlers: textModelHandlers,
    vueProps: [bool("disabled"), str("modelValue", "#4f46e5", { attr: "value", alwaysPass: true }), str("name")]
  }),
  component("CindorCheckbox", "cindor-checkbox", {
    slots: slots.default,
    vueHandlers: checkedModelHandlers,
    vueProps: [bool("modelValue", false, { attr: "checked" }), bool("disabled"), str("name"), bool("required"), str("value", "on", { alwaysPass: true })]
  }),
  component("CindorSelect", "cindor-select", {
    slots: slots.default,
    vueHandlers: [
      handler("input", {
        emitName: "input",
        modelEmit: "update:modelValue",
        modelHostProperty: "value",
        modelHostType: "SelectHost"
      }),
      handler("change", {
        emitName: "change",
        modelEmit: "update:modelValue",
        modelHostProperty: "value",
        modelHostType: "SelectHost"
      })
    ],
    vueProps: [bool("disabled"), str("modelValue", "", { attr: "value", alwaysPass: true }), str("name"), bool("required")]
  }),
  component("CindorStack", "cindor-stack", {
    slots: slots.default,
    vueProps: [
      typed("align", "StackAlign", "stretch"),
      typed("direction", "StackDirection", "vertical"),
      typed("gap", "StackGap", "3"),
      typed("justify", "StackJustify", "start"),
      bool("wrap")
    ]
  }),
  component("CindorRadio", "cindor-radio", {
    slots: slots.default,
    vueHandlers: [
      handler("input", {
        emitName: "input",
        modelEmit: "update:checked",
        modelHostProperty: "checked",
        modelHostType: "CheckboxHost"
      }),
      handler("change", {
        emitName: "change",
        modelEmit: "update:checked",
        modelHostProperty: "checked",
        modelHostType: "CheckboxHost"
      })
    ],
    vueProps: [bool("checked"), bool("disabled"), str("name"), bool("required"), str("value", "on", { alwaysPass: true })]
  }),
  component("CindorDialog", "cindor-dialog", {
    slots: slots.default,
    vueHandlers: [
      handler("close", {
        emitName: "close",
        modelEmit: "update:open",
        modelValueExpression: "false"
      }),
      handler("cancel", {
        emitName: "cancel",
        modelEmit: "update:open",
        modelValueExpression: "false"
      })
    ],
    vueProps: [bool("modal", true), bool("open")]
  }),
  component("CindorTextarea", "cindor-textarea", {
    vueHandlers: textModelHandlers,
    vueProps: [bool("disabled"), str("modelValue", "", { attr: "value", alwaysPass: true }), str("name"), str("placeholder"), bool("readonly"), bool("required"), num("rows", 4)]
  }),
  component("CindorSwitch", "cindor-switch", {
    slots: slots.default,
    vueHandlers: checkedModelHandlers,
    vueProps: [bool("disabled"), bool("modelValue", false, { attr: "checked" }), str("name"), bool("required"), str("value", "on", { alwaysPass: true })]
  }),
  component("CindorTabPanel", "cindor-tab-panel", {
    slots: slots.default,
    vueProps: [str("label"), str("value")]
  }),
  component("CindorTabs", "cindor-tabs", {
    slots: slots.default,
    vueHandlers: [
      handler("change", {
        emitName: "change",
        modelEmit: "update:value",
        modelHostProperty: "value",
        modelHostType: "SelectHost"
      })
    ],
    vueProps: [str("value")]
  }),
  component("CindorAccordion", "cindor-accordion", {
    slots: slots.default,
    vueHandlers: [
      handler("toggle", {
        emitName: "toggle",
        modelEmit: "update:open",
        modelHostProperty: "open",
        modelHostType: "OpenHost"
      })
    ],
    vueProps: [bool("open")]
  }),
  component("CindorTreeItem", "cindor-tree-item", {
    slots: slots.all,
    vueProps: [bool("disabled"), bool("expanded"), str("label"), bool("selected"), str("value")]
  }),
  component("CindorTreeView", "cindor-tree-view", {
    slots: slots.default,
    reactEvents: ["change", "input"],
    vueHandlers: textModelHandlers,
    vueProps: [str("modelValue", "", { attr: "value", alwaysPass: true })]
  }),
  component("CindorStatCard", "cindor-stat-card", {
    slots: slots.default,
    vueProps: [str("change"), str("label"), typed("tone", "StatCardTone", "neutral"), str("value")]
  }),
  component("CindorTimeline", "cindor-timeline", {
    slots: slots.default
  }),
  component("CindorTimelineItem", "cindor-timeline-item", {
    slots: slots.all
  }),
  component("CindorTransferList", "cindor-transfer-list", {
    slots: slots.default,
    reactEvents: ["change", "input"],
    vueHandlers: [
      handler("input", {
        emitName: "input",
        modelEmit: "update:modelValue",
        modelHostProperty: "selectedValues",
        modelHostType: "HTMLElement & { selectedValues: string[] }"
      }),
      handler("change", {
        emitName: "change",
        modelEmit: "update:modelValue",
        modelHostProperty: "selectedValues",
        modelHostType: "HTMLElement & { selectedValues: string[] }"
      })
    ],
    vueProps: [
      str("availableLabel", "Available", { attr: "available-label", alwaysPass: true }),
      bool("disabled"),
      str("name"),
      bool("required"),
      str("selectedLabel", "Selected", { attr: "selected-label", alwaysPass: true }),
      arr("modelValue", "string[]", { attr: "selected-values" }),
      num("size", 8)
    ]
  }),
  component("CindorSortableList", "cindor-sortable-list", {
    reactEvents: ["reorder", "input", "change"],
    vueHandlers: [handler("reorder"), handler("input"), handler("change")],
    vueProps: [
      bool("disabled"),
      str("dragHandleLabel", "Drag to reorder", { attr: "drag-handle-label", alwaysPass: true }),
      str("emptyMessage", "No items to display.", { attr: "empty-message", alwaysPass: true }),
      arr("items", "unknown[]"),
      func("itemKey", "SortableListItemKey<unknown> | undefined"),
      str("moveDownLabel", "Move item down", { attr: "move-down-label", alwaysPass: true }),
      str("moveUpLabel", "Move item up", { attr: "move-up-label", alwaysPass: true }),
      func("renderItem", "SortableListItemRenderer<unknown> | undefined")
    ]
  }),
  component("CindorVirtualList", "cindor-virtual-list", {
    reactEvents: ["range-change"],
    vueHandlers: [handler("range-change")],
    vueProps: [
      str("emptyMessage", "No items to display.", { alwaysPass: true, attr: "empty-message" }),
      str("height", "24rem", { alwaysPass: true }),
      num("itemHeight", 72, { attr: "item-height" }),
      arr("items", "unknown[]"),
      func("itemKey", "VirtualListItemKey<unknown> | undefined"),
      num("overscan", 4),
      func("renderItem", "VirtualListItemRenderer<unknown> | undefined")
    ]
  }),
  component("CindorJsonViewer", "cindor-json-viewer", {
    vueProps: [
      obj("data", "JsonViewerValue | Record<string, unknown> | unknown[] | undefined", { defaultFactory: "() => undefined" }),
      str("emptyMessage", "No JSON to display.", { attr: "empty-message", alwaysPass: true }),
      num("expandedDepth", 1, { attr: "expanded-depth" }),
      str("invalidMessage", "Unable to parse JSON.", { attr: "invalid-message", alwaysPass: true }),
      str("rootLabel", "JSON", { attr: "root-label", alwaysPass: true }),
      str("value", "", { alwaysPass: true })
    ]
  }),
  component("CindorMarkdownEditor", "cindor-markdown-editor", {
    reactEvents: ["input", "change"],
    vueHandlers: textModelHandlers,
    vueProps: [
      bool("disabled"),
      typed("mode", "MarkdownEditorMode", "write"),
      str("name"),
      str("placeholder", "Write in Markdown...", { alwaysPass: true }),
      str("previewEmptyMessage", "Nothing to preview yet.", { attr: "preview-empty-message", alwaysPass: true }),
      str("previewLabel", "Preview", { attr: "preview-label", alwaysPass: true }),
      bool("readonly"),
      bool("required"),
      num("rows", 14),
      str("splitLabel", "Split", { attr: "split-label", alwaysPass: true }),
      str("toolbarLabel", "Formatting", { attr: "toolbar-label", alwaysPass: true }),
      str("writeLabel", "Write", { attr: "write-label", alwaysPass: true }),
      str("modelValue", "", { attr: "value", alwaysPass: true })
    ]
  }),
  component("CindorKanbanBoard", "cindor-kanban-board", {
    reactEvents: ["select", "card-action", "card-move"],
    vueHandlers: [
      handler("select", {
        emitName: "select",
        modelEmit: "update:selectedCardId",
        modelHostProperty: "selectedCardId",
        modelHostType: "HTMLElement & { selectedCardId: string }"
      }),
      handler("card-action"),
      handler("card-move")
    ],
    vueProps: [
      arr("columns", "KanbanBoardColumn[]"),
      str("emptyMessage", "No cards in this column.", { attr: "empty-message", alwaysPass: true }),
      str("selectedCardId", "", { attr: "selected-card-id", alwaysPass: true })
    ]
  }),
  component("CindorWorkspaceSwitcher", "cindor-workspace-switcher", {
    reactEvents: ["toggle", "select", "input", "change"],
    vueHandlers: [
      currentOpen,
      handler("select"),
      handler("input", {
        emitName: "input",
        modelEmit: "update:modelValue",
        modelHostProperty: "value",
        modelHostType: "HTMLElement & { value: string }"
      }),
      handler("change", {
        emitName: "change",
        modelEmit: "update:modelValue",
        modelHostProperty: "value",
        modelHostType: "HTMLElement & { value: string }"
      })
    ],
    vueProps: [
      bool("disabled"),
      str("emptyMessage", "No workspaces match your search.", { attr: "empty-message", alwaysPass: true }),
      arr("items", "WorkspaceSwitcherItem[]"),
      bool("open"),
      str("placeholder", "Select a workspace", { alwaysPass: true }),
      str("searchLabel", "Search workspaces", { attr: "search-label", alwaysPass: true }),
      str("searchPlaceholder", "Search workspaces", { attr: "search-placeholder", alwaysPass: true }),
      str("title", "Switch workspace", { alwaysPass: true }),
      str("triggerLabel", "Toggle workspace switcher", { attr: "trigger-label", alwaysPass: true }),
      str("modelValue", "", { attr: "value", alwaysPass: true })
    ]
  }),
  component("CindorSideNav", "cindor-side-nav", {
    slots: slots.default
  }),
  component("CindorSideNavItem", "cindor-side-nav-item", {
    slots: slots.all,
    vueProps: [bool("current"), bool("disabled"), bool("expanded"), str("href"), str("label"), str("rel"), str("target"), str("value")]
  })
];
