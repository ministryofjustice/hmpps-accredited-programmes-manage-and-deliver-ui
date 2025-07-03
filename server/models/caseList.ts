export default interface Caselist {
  referrals: Referral[]
}

export type Referral = {
  id: string
  personName: string
  personCrn: string
  status: string
}
