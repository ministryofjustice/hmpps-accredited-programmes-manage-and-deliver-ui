declare module '@ministryofjustice/hmpps-probation-frontend-components' {
  import type { RequestHandler } from 'express'

  interface TimeoutOptions {
    response: number
    deadline: number
  }

  interface PageComponentsOptions {
    pdsUrl: string
    timeoutOptions: TimeoutOptions
    logger: unknown
  }

  interface PdsComponents {
    getPageComponents(options: PageComponentsOptions): RequestHandler
  }

  const pdsComponents: PdsComponents

  export default pdsComponents
}
