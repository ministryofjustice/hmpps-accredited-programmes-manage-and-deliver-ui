import { Request, Response } from 'express'
import { ModuleSessionTemplate, SessionScheduleRequest } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'

import SessionScheduleWhichPresenter from './sessionWhich/sessionScheduleWhichPresenter'
import SessionScheduleWhichView from './sessionWhich/sessionScheduleWhichView'
import AddSessionDetailsPresenter from './sessionDetails/addSessionDetailsPresenter'
import AddSessionDetailsView from './sessionDetails/addSessionDetailsView'
import SessionScheduleAttendancePresenter from './sessionAttendance/sessionScheduleAttendancePresenter'
import SessionScheduleAttendanceView from './sessionAttendance/sessionScheduleAttendanceView'
import CreateSessionScheduleForm from './sessionScheduleForm'
import SessionScheduleCyaPresenter from './cya/SessionScheduleCyaPresenter'
import SessionScheduleCyaView from './cya/sessionScheduleCyaView'

type SessionScheduleSessionData = Partial<SessionScheduleRequest> & {
  sessionName?: string
  referralName?: string
  moduleSessionTemplates?: Record<string, ModuleSessionTemplate[]>
  moduleNames?: Record<string, string>
  groupCode?: string
  groupIdsByCode?: Record<string, string>
  moduleIdsByGroupAndName?: Record<string, Record<string, string>>
}

export default class SessionScheduleController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showSessionSchedule(req: Request, res: Response): Promise<void> {
    const params = req.params as Record<string, string | undefined>
    let { groupId } = params
    let { moduleId } = params
    const groupCodeParam = params.groupCode
    const moduleNameParam = params.moduleName

    const { username } = req.user
    const groupCodeFromQuery = typeof req.query.groupCode === 'string' ? req.query.groupCode : ''
    const moduleNameFromQuery = typeof req.query.moduleName === 'string' ? req.query.moduleName : ''

    const resolvedGroupCode = groupCodeParam || groupCodeFromQuery || req.session.sessionScheduleData?.groupCode || ''
    const moduleIdsByGroup = req.session.sessionScheduleData?.moduleIdsByGroupAndName ?? {}

    if (!groupId && groupCodeParam) {
      groupId = req.session.sessionScheduleData?.groupIdsByCode?.[groupCodeParam]
    }

    if (!moduleId && moduleNameParam) {
      moduleId = moduleIdsByGroup[groupCodeParam ?? resolvedGroupCode]?.[moduleNameParam]
    }

    if (!moduleId && moduleNameFromQuery) {
      moduleId = moduleIdsByGroup[resolvedGroupCode]?.[moduleNameFromQuery]
    }

    if (!groupId || !moduleId) {
      const fallbackTarget = resolvedGroupCode
        ? `/group/${encodeURIComponent(resolvedGroupCode)}/sessions-and-attendance`
        : '/groups/started'
      return res.redirect(fallbackTarget)
    }

    const resolvedGroupId = groupId
    const resolvedModuleId = moduleId

    let formError: FormValidationError | null = null

    const cachedModuleTemplates =
      req.session.sessionScheduleData?.moduleSessionTemplates?.[resolvedModuleId] ?? ([] as ModuleSessionTemplate[])

    let sourceTemplates: { id: string; number: number; name: string }[] = cachedModuleTemplates

    if (!sourceTemplates.length) {
      sourceTemplates = await this.accreditedProgrammesManageAndDeliverService.getSessionTemplates(
        username,
        resolvedGroupId,
        resolvedModuleId,
      )
    }

    const sessionTemplates: ModuleSessionTemplate[] = sourceTemplates.map(template => ({
      id: template.id,
      number: template.number,
      name: template.name,
    }))

    if (sessionTemplates.length) {
      req.session.sessionScheduleData = {
        ...(req.session.sessionScheduleData ?? {}),
        groupCode: resolvedGroupCode || req.session.sessionScheduleData?.groupCode,
        moduleSessionTemplates: {
          ...(req.session.sessionScheduleData?.moduleSessionTemplates ?? {}),
          [resolvedModuleId]: sessionTemplates,
        },
        moduleNames: {
          ...(req.session.sessionScheduleData?.moduleNames ?? {}),
          ...(moduleNameParam
            ? {
                [resolvedModuleId]: moduleNameParam,
              }
            : {}),
          ...(moduleNameFromQuery
            ? {
                [resolvedModuleId]: moduleNameFromQuery,
              }
            : {}),
        },
        groupIdsByCode: {
          ...(req.session.sessionScheduleData?.groupIdsByCode ?? {}),
          ...(resolvedGroupCode ? { [resolvedGroupCode]: resolvedGroupId } : {}),
        },
        moduleIdsByGroupAndName: {
          ...(req.session.sessionScheduleData?.moduleIdsByGroupAndName ?? {}),
          ...(resolvedGroupCode && (moduleNameParam || moduleNameFromQuery)
            ? {
                [resolvedGroupCode]: {
                  ...(req.session.sessionScheduleData?.moduleIdsByGroupAndName?.[resolvedGroupCode] ?? {}),
                  [(moduleNameParam || moduleNameFromQuery) as string]: resolvedModuleId,
                },
              }
            : {}),
        },
      }
    }

    if (req.method === 'POST') {
      const selectedTemplateId = req.body['session-template']

      if (!selectedTemplateId) {
        res.status(400)
        formError = {
          errors: [
            {
              formFields: ['session-template'],
              errorSummaryLinkedField: 'session-template',
              message: 'Select a session',
            },
          ],
        }
      } else {
        const selectedTemplate = sessionTemplates.find(template => template.id === selectedTemplateId)
        req.session.sessionScheduleData = {
          ...(req.session.sessionScheduleData ?? {}),
          sessionTemplateId: selectedTemplateId,
        }
        return res.redirect(`/${resolvedGroupId}/${resolvedModuleId}/schedule-group-session-details`)
      }
    }

    const presenter = new SessionScheduleWhichPresenter(
      resolvedGroupId,
      resolvedModuleId,
      resolvedGroupCode,
      moduleNameParam || moduleNameFromQuery || req.session.sessionScheduleData?.moduleNames?.[resolvedModuleId] || '',
      sessionTemplates,
      formError,
      req.session.sessionScheduleData?.sessionTemplateId,
    )
    const view = new SessionScheduleWhichView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async scheduleGroupSessionDetails(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, moduleId } = req.params
    const { sessionScheduleData } = req.session
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateSessionScheduleForm(req).sessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.sessionScheduleData = {
          ...sessionScheduleData,
          referralIds: data.paramsForUpdate.referralIds,
          facilitators: data.paramsForUpdate.facilitators,
          startDate: data.paramsForUpdate.startDate,
          startTime: data.paramsForUpdate.startTime,
          endTime: data.paramsForUpdate.endTime,
        }
        return res.redirect(`/${groupId}/${moduleId}/session-review-details`)
      }
    }

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails(
      username,
      groupId,
      moduleId,
    )

    const presenter = new AddSessionDetailsPresenter(
      `/${groupId}/${moduleId}`,
      sessionDetails,
      formError,
      sessionScheduleData,
      userInputData,
    )
    const view = new AddSessionDetailsView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showSessionAttendance(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const sessionType = (req.query.sessionType as 'getting-started' | 'one-to-one') || 'getting-started'

    const groupIdentifier = (req.params.groupId || '').trim()
    if (!groupIdentifier) {
      return res.redirect('/groups/started')
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    let resolvedGroupId: string | undefined = uuidRegex.test(groupIdentifier) ? groupIdentifier : undefined
    let resolvedGroupCode: string | undefined = uuidRegex.test(groupIdentifier) ? undefined : groupIdentifier

    if (!resolvedGroupId && resolvedGroupCode) {
      resolvedGroupId = req.session.sessionScheduleData?.groupIdsByCode?.[resolvedGroupCode]

      if (!resolvedGroupId) {
        const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion(
          username,
          resolvedGroupCode,
        )

        if (groupDetails?.id) {
          resolvedGroupId = groupDetails.id
          resolvedGroupCode = groupDetails.code || resolvedGroupCode
        }
      }
    }

    if (!resolvedGroupId) {
      return res.redirect('/groups/started')
    }

    const groupSessionsData = await this.accreditedProgrammesManageAndDeliverService.getGroupSessions(
      username,
      resolvedGroupId,
    )

    const modulesWithTemplates = await Promise.all(
      (groupSessionsData.modules || []).map(async module => {
        const { sessionTemplates } = await this.accreditedProgrammesManageAndDeliverService.getModuleSessionTemplates(
          username,
          resolvedGroupId,
          module.id,
        )

        return {
          ...module,
          sessionTemplates,
          sessions: module.sessions?.length ? module.sessions : sessionTemplates,
        }
      }),
    )

    const modulesTemplateMap: Record<string, ModuleSessionTemplate[]> = {
      ...(req.session.sessionScheduleData?.moduleSessionTemplates ?? {}),
    }

    const moduleNamesMap: Record<string, string> = {
      ...(req.session.sessionScheduleData?.moduleNames ?? {}),
    }

    const moduleIdsByGroupAndName: Record<string, Record<string, string>> = {
      ...(req.session.sessionScheduleData?.moduleIdsByGroupAndName ?? {}),
    }

    const groupIdsByCode: Record<string, string> = {
      ...(req.session.sessionScheduleData?.groupIdsByCode ?? {}),
    }

    const groupCode = groupSessionsData.group?.code || resolvedGroupCode
    if (groupCode) {
      groupIdsByCode[groupCode] = resolvedGroupId
    }

    modulesWithTemplates.forEach(module => {
      if (Array.isArray(module.sessionTemplates) && module.sessionTemplates.length) {
        modulesTemplateMap[module.id] = module.sessionTemplates.map(template => ({
          id: template.id,
          number: template.number,
          name: template.name,
        }))
      }
      if (module.name) {
        moduleNamesMap[module.id] = module.name
      }

      if (groupCode && module.name) {
        const currentGroupModuleMap = moduleIdsByGroupAndName[groupCode] ?? {}
        currentGroupModuleMap[module.name] = module.id
        moduleIdsByGroupAndName[groupCode] = currentGroupModuleMap
      }
    })

    req.session.sessionScheduleData = {
      ...(req.session.sessionScheduleData ?? {}),
      groupCode: groupCode ?? req.session.sessionScheduleData?.groupCode,
      moduleSessionTemplates: modulesTemplateMap,
      moduleNames: moduleNamesMap,
      groupIdsByCode,
      moduleIdsByGroupAndName,
    }

    const presenterGroupCode = req.session.sessionScheduleData?.groupCode || groupCode

    const presenter = new SessionScheduleAttendancePresenter(
      resolvedGroupId,
      presenterGroupCode,
      sessionType,
      null,
      null,
      {
        ...groupSessionsData,
        modules: modulesWithTemplates,
      },
    )
    const view = new SessionScheduleAttendanceView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async scheduleGroupSessionCya(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, moduleId } = req.params
    const { sessionScheduleData } = req.session
    const scheduleData = (sessionScheduleData ?? {}) as SessionScheduleSessionData

    if (req.method === 'POST') {
      const {
        sessionName: _sessionName,
        referralName: _referralName,
        moduleSessionTemplates: _moduleSessionTemplates,
        moduleNames: _moduleNames,
        groupCode: _cachedGroupCode,
        groupIdsByCode: _groupIdsByCode,
        moduleIdsByGroupAndName: _moduleIdsByGroupAndName,
        ...sessionDataForApi
      } = scheduleData

      const formattedStartDate = (() => {
        if (!sessionDataForApi.startDate) {
          throw new Error('Session start date missing for schedule submission')
        }
        const [day, month, year] = sessionDataForApi.startDate.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      })()

      const response = await this.accreditedProgrammesManageAndDeliverService.createSessionSchedule(username, groupId, {
        ...(sessionDataForApi as SessionScheduleRequest),
        startDate: formattedStartDate,
      })
      // Clear session data on submission
      req.session.sessionScheduleData = {}
      // Change this when page exists
      return res.redirect(`/${groupId}/${moduleId}/session-review-details?message=${response.message}`)
    }

    const presenter = new SessionScheduleCyaPresenter(`/${groupId}/${moduleId}`, scheduleData)
    const view = new SessionScheduleCyaView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
