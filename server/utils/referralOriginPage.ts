import { Request } from 'express'

const defaultReferralOriginPage = (referralId: string): string => `/referral-details/${referralId}/personal-details`

export const setReferralOriginPage = (req: Request, referralId: string, originPage: string = req.path): void => {
  req.session.originPage = originPage
  req.session.referralOriginPages = {
    ...(req.session.referralOriginPages ?? {}),
    [referralId]: originPage,
  }
}

export const getReferralOriginPage = (req: Request, referralId: string): string => {
  return (
    req.session.referralOriginPages?.[referralId] ?? req.session.originPage ?? defaultReferralOriginPage(referralId)
  )
}
