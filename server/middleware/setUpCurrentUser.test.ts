import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'

import { HmppsUser } from '../interfaces/hmppsUser'
import setUpCurrentUser from './setUpCurrentUser'

function createToken(claims: Record<string, unknown>) {
  const payload = {
    user_name: 'USER1',
    scope: ['read', 'write'],
    auth_source: 'delius',
    jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
    client_id: 'clientid',
    ...claims,
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

function appWithToken(token: string) {
  const app = express()

  app.use((req, res, next) => {
    res.locals.user = { username: 'USER1', authSource: 'delius', token } as HmppsUser
    next()
  })
  app.use(setUpCurrentUser())
  app.get('/', (req, res) => {
    res.json(res.locals.user)
  })

  return app
}

describe('setUpCurrentUser', () => {
  it('should populate the user details from the token', async () => {
    const token = createToken({
      name: 'FIRST LAST',
      user_id: '2500000001',
      user_uuid: '11111111-1111-1111-1111-111111111111',
      authorities: ['ROLE_PROBATION'],
    })

    const response = await request(appWithToken(token)).get('/').expect(200)

    expect(response.body).toEqual({
      username: 'USER1',
      authSource: 'delius',
      token,
      userId: '2500000001',
      userUuid: '11111111-1111-1111-1111-111111111111',
      name: 'FIRST LAST',
      displayName: 'First Last',
      userRoles: ['PROBATION'],
    })
  })

  it('should leave userUuid unset when the token has no user_uuid claim', async () => {
    const token = createToken({ name: 'FIRST LAST', user_id: '2500000001' })

    const response = await request(appWithToken(token)).get('/').expect(200)

    expect(response.body.userId).toBe('2500000001')
    expect(response.body).not.toHaveProperty('userUuid')
  })
})
