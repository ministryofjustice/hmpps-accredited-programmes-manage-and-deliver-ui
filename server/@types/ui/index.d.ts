export type MojTimelineItem = HtmlOrText & {
  byline: {
    text: string
  }
  datetime: {
    timestamp: string
    type?: 'date' | 'datetime' | 'shortdate' | 'shortdatetime' | 'time'
  }
  label: HtmlOrText
}

export type ValueTextTuple = {
  value: T
  text: string
}

// The time input component is custom to this application.
export interface TimeInputArgs {
  /*
    This is used for the main component and to compose id attribute for each item.
  */
  id: string

  /*
    Optional prefix. This is used to prefix each `item.name` using `-`.
  */
  namePrefix?: string | null

  /*
    An array of input objects with name, value and classes.
  */
  items?: TimeInputArgsItem[] | null

  /*
    Options for the hint component.
  */
  hint?: HintArgs | null

  /*
    Options for the error message component. The error message component will not display if you use a falsy value for `errorMessage`, for example `false` or `null`.
  */
  errorMessages?: ErrorMessageArgs[] | null

  /*
    Options for the form-group wrapper
  */
  formGroup?: TimeInputArgsFormGroup | null

  /*
    Options for the fieldset component (e.g. legend).
  */
  fieldset?: FieldsetArgs | null

  /*
    Classes to add to the date-input container.
  */
  classes?: string | null

  /*
    HTML attributes (for example data attributes) to add to the date-input container.
  */
  attributes?: Record<string, unknown> | null

  /*
    Arguments for the AM / PM select component.
  */
  select: SelectArgs
}

export interface TimeInputArgsItem {
  /*
    Item-specific id. If provided, it will be used instead of the generated id.
  */
  id?: string | null

  /*
    Item-specific name attribute.
  */
  name: string

  /*
    Item-specific label text. If provided, this will be used instead of `name` for item label text.
  */
  label?: string | null

  /*
    If provided, it will be used as the initial value of the input.
  */
  value?: string | null

  /*
    Attribute to [identify input purpose](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html), for instance "bday-day". See [autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill) for full list of attributes that can be used.
  */
  autocomplete?: string | null

  /*
    Attribute to [provide a regular expression pattern](https://www.w3.org/TR/html51/sec-forms.html#the-pattern-attribute), used to match allowed character combinations for the input value.
  */
  pattern?: string | null

  /*
    Classes to add to date input item.
  */
  classes?: string | null

  /*
    HTML attributes (for example data attributes) to add to the date input tag.
  */
  attributes?: Record<string, unknown> | null
}

export interface TimeInputArgsFormGroup {
  /*
    Classes to add to the form group (e.g. to show error state for the whole group)
  */
  classes?: string | null
}

export interface MultiSelectTableArgs {
  /*
    Prefix for generating unique IDs for table elements
  */
  idPrefix: string

  /*
    Array of column headers with optional numeric flag for right-alignment
  */
  headers: Array<{
    text: string
    numeric?: boolean
  }>

  /*
    Array of table rows containing row data
  */
  rows: Array<{
    /*
      Unique identifier for the row
    */
    id: string

    /*
      Whether the row is currently selected
    */
    selected?: boolean

    /*
      Array of cell values - can be plain text strings or objects with html/text properties
    */
    cells: Array<
      | string
      | {
          text?: string
          html?: string
        }
    >

    /*
      Optional array indicating which cells should be right-aligned (numeric)
    */
    cellsNumeric?: boolean[]
  }>
}
