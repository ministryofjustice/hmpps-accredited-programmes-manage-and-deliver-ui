import { faker } from '@faker-js/faker'

// Make faker deterministic (stops snapshot/brittle failures)
faker.seed(12345)
faker.setDefaultRefDate(new Date('2020-01-01T00:00:00Z'))
