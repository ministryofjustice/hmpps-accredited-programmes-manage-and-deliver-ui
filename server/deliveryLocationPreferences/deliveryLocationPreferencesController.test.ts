import request from 'supertest'
import type { Express } from 'express'

import { FakeAccreditedProgrammesManageAndDeliverService } from '../testutils/fakeAccreditedProgrammesManageAndDeliverService'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import { DeliveryLocationPreferencesFormDataFactory } from '../testutils/factories/deliveryLocationPreferences'

const fakeManageAndDeliverService = new FakeAccreditedProgrammesManageAndDeliverService()

describe('DeliveryLocationPreferencesController', () => {
  describe(`getDeliveryLocationPreferencesFormData`, () => {
    let app: Express

    beforeEach(() => {
      app = appWithAllRoutes({
        services: {
          accreditedProgrammesManageAndDeliverService: fakeManageAndDeliverService as unknown,
        },
      })
    })

    const fakeApiService = new FakeAccreditedProgrammesManageAndDeliverService()

    it(`should fetch and retrieve the data`, async () => {
      // Given
      const data = DeliveryLocationPreferencesFormDataFactory.build()
      fakeManageAndDeliverService.alwaysReturnData(data)
      await request(app)
        .get('/referral/the-referral-id/delivery-location-preferences')
        .expect(200)
        .expect(res => {
          expect(res.ok).toBe(true)
        })
    }, 10_000)
  })
})
