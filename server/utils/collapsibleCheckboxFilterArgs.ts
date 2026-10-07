export interface CollapsibleCheckboxFilterOption {
  value: string
  label: string
  checked?: boolean
}

export interface CollapsibleCheckboxFilterGroup {
  label: string
  options: CollapsibleCheckboxFilterOption[]
}

export interface CollapsibleCheckboxFilterArgs {
  title: string
  name: string
  dataQa: string
  selectedCount?: number
  options?: CollapsibleCheckboxFilterOption[]
  groups?: CollapsibleCheckboxFilterGroup[]
  searchable?: boolean
  searchLabel?: string
}
