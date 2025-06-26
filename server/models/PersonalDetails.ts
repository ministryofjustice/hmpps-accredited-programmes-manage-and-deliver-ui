export default interface PersonalDetails {
  crn: string
  nomsNumber: string
  name: {
    forename: string
    surname: string
  }
  dateOfBirth: string
  ethnicity: string
  gender: string
  probationDeliveryUnit: {
    code: string
    description: string
  }
  setting: string
}
