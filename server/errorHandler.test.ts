import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render content without stack in dev mode', () => {
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
        expect(res.text).toContain('If you typed the web address, check it is correct.')
        expect(res.text).toContain('Case list')
        expect(res.text).not.toContain('NotFoundError: Not Found')
        expect(res.text).not.toContain('Not found')
      })
  })

  it('should render content without stack in production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
        expect(res.text).toContain('If you typed the web address, check it is correct.')
        expect(res.text).toContain('Case list')
        expect(res.text).not.toContain('NotFoundError: Not Found')
        expect(res.text).not.toContain('Not found')
      })
  })
})

describe('GET 500', () => {
  it('should render 500 heading and body without debug details', () => {
    return request(app)
      .get('/route-that-throws-500')
      .expect(500)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Sorry, there is a problem with the service')
        expect(res.text).toContain('Try reloading the page')
        expect(res.text).toContain('Tech Portal')
        expect(res.text).not.toContain('Test 500 error') // error message hidden
      })
  })
})

describe('GET 503', () => {
  it('should render 503 heading in dev mode', () => {
    return request(app)
      .get('/route-that-returns-503')
      .expect(503)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Sorry, the service is unavailable')
      })
  })

  it('should render 503 heading in production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/route-that-returns-503')
      .expect(503)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Sorry, the service is unavailable')
      })
  })
})
