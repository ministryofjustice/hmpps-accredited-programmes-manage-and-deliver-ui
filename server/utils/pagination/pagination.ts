import { Page } from '../../shared/models/pagination'

interface GovukPaginationArgs {
  classes?: string
  items?: {
    number?: number
    visuallyHiddenText?: string
    href: string
    current?: boolean
    ellipsis?: boolean
  }[]
  previous?: {
    text?: string
    labelText?: string
    href: string
  }
  next?: {
    text?: string
    labelText?: string
    href: string
  }
}

export default class Pagination {
  constructor(
    private readonly page: Page<unknown>,
    private readonly params: string | null = null,
  ) {}

  private constructPageItems(pageNumberRange: number[], chosenPageNumber: number): GovukPaginationArgs['items'] {
    return pageNumberRange.map(pageNumber => {
      return {
        number: pageNumber,
        current: chosenPageNumber === pageNumber,
        href: this.params ? `?${this.params}&page=${pageNumber}` : `?page=${pageNumber}`,
      }
    })
  }

  get govukPaginationArgs(): GovukPaginationArgs {
    const { totalPages } = this.page
    if (totalPages <= 1) {
      return {
        items: [],
      }
    }
    const zeroIndexPageNumber = this.page.number
    const chosenPageNumber = zeroIndexPageNumber + 1
    const items: GovukPaginationArgs['items'] = []

    if (totalPages <= 5) {
      items.push(
        ...this.constructPageItems(
          Array.from(new Array(totalPages).keys()).map(i => i + 1),
          chosenPageNumber,
        ),
      )
    } else if (chosenPageNumber < 4) {
      items.push(...this.constructPageItems([1, 2, 3, 4], chosenPageNumber))
      items.push({ ellipsis: true, href: '' })
      items.push(...this.constructPageItems([totalPages], chosenPageNumber))
    } else if (chosenPageNumber > totalPages - 3) {
      const lastPages = [totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      items.push(...this.constructPageItems([1], chosenPageNumber))
      items.push({ ellipsis: true, href: '' })
      items.push(...this.constructPageItems(lastPages, chosenPageNumber))
    } else {
      const middlePages = [chosenPageNumber - 1, chosenPageNumber, chosenPageNumber + 1]
      items.push(...this.constructPageItems([1], chosenPageNumber))
      items.push({ ellipsis: true, href: '' })
      items.push(...this.constructPageItems(middlePages, chosenPageNumber))
      items.push({ ellipsis: true, href: '' })
      items.push(...this.constructPageItems([totalPages], chosenPageNumber))
    }

    return {
      items,
      previous:
        chosenPageNumber === 1
          ? undefined
          : {
              href: this.params ? `?${this.params}&page=${chosenPageNumber - 1}` : `?page=${chosenPageNumber - 1}`,
            },
      next:
        chosenPageNumber === totalPages
          ? undefined
          : {
              href: this.params ? `?${this.params}&page=${chosenPageNumber + 1}` : `?page=${chosenPageNumber + 1}`,
            },
    }
  }
}
