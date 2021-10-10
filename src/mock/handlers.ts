import { rest } from 'msw'
import { isNumeric } from 'rxjs/internal-compatibility'
import appr from './fixtures/appr'
import apprcrit from './fixtures/apprcrit'
import cevalgrid from './fixtures/cevalgrid'
import criterion from './fixtures/criterion'
import evalplan from './fixtures/evalplan'
import groupassign from './fixtures/groupassign'
import groups from './fixtures/groups'
import role from './fixtures/role'
import situations from './fixtures/situations'
import allUsers from './fixtures/users'

const parseFormDataVariable = (currentObj, key, val) => {
  const keyValue = [...key.matchAll(/(\w+)(?=\[(\w+)\])*/g)]
  let currentVariable = currentObj
  keyValue.forEach((value, index, originalArray) => {
    // Look ahead to check the variable type.
    const isNumericIndex =
      index + 1 < originalArray.length
        ? !isNaN(originalArray[index + 1][0])
        : false
    const currentIndex = isNaN(value[0]) ? value[0] : parseInt(value[0], 10)

    if (!currentVariable[currentIndex]) {
      currentVariable[currentIndex] = isNumericIndex ? [] : {}
    }
    if (index === keyValue.length - 1) {
      currentVariable[currentIndex] = val
    }
    currentVariable = currentVariable[currentIndex]
  })
}

const entities = {
  criterion,
  clsituation: situations,
  group_assign: groupassign,
  group: groups,
  role,
  evalplan,
  cevalgrid,
  appraisal: appr,
  appr_crit: apprcrit,
}

const getEntities = (entitytype, queryJSON) => {
  let returnedEntities = []
  if (entities[entitytype]) {
    returnedEntities = entities[entitytype]
    if (queryJSON) {
      const query = JSON.parse(queryJSON)
      returnedEntities = returnedEntities.filter((e) => {
        let isMacthing = true
        for (const property in query) {
          if (e[property] !== query[property]) {
            isMacthing = false
          }
        }
        return isMacthing
      })
    }
  }
  return returnedEntities
}

const queryEntity = (entityType, req, res, ctx) => {
  const { query } = req.body as any
  const decodedQuery = decodeURIComponent(query)
  const returnedEntities = getEntities(entityType, decodedQuery)

  return res(ctx.json(returnedEntities))
}

let currentUserId = 0

const restServerCallback = {
  core_webservice_get_site_info: (req, res, ctx) => {
    const { wstoken } = req.body as any
    const foundUser = allUsers.find((u) => u.token === wstoken)
    if (foundUser) {
      return res(
        ctx.json({
          userid: foundUser.userid,
          fullname: foundUser.fullname,
          firstname: foundUser.firstname,
          lastname: foundUser.lastname,
          username: foundUser.username,
          userpictureurl: foundUser.userpictureurl,
        })
      )
    } else {
      return res(ctx.json({}))
    }
  },
  local_cveteval_get_user_type: (req, res, ctx) => {
    const { wstoken } = req.body as any
    const foundUser = allUsers.find((u) => u.token === wstoken)
    if (foundUser) {
      return res(
        ctx.json({
          type: foundUser.type,
        })
      )
    } else {
      return res(ctx.json({}))
    }
  },
  local_cveteval_get_user_profile: (req, res, ctx) => {
    let { userid } = req.body as any
    userid = parseInt(userid, 10)
    if (!userid) {
      userid = currentUserId
    }
    const foundUser = allUsers.find((u) => u.userid === userid)
    if (foundUser) {
      return res(ctx.json(foundUser))
    } else {
      return res(ctx.json({}))
    }
  },
  local_cveteval_get_appraisal: (req, res, ctx) => {
    return queryEntity('appraisal', req, res, ctx)
  },
  local_cveteval_get_appr_crit: (req, res, ctx) => {
    return queryEntity('appr_crit', req, res, ctx)
  },
  local_cveteval_get_evalplan: (req, res, ctx) => {
    return queryEntity('evalplan', req, res, ctx)
  },
  local_cveteval_get_clsituation: (req, res, ctx) => {
    return queryEntity('clsituation', req, res, ctx)
  },
  local_cveteval_get_criterion: (req, res, ctx) => {
    return queryEntity('criterion', req, res, ctx)
  },
  local_cveteval_get_cevalgrid: (req, res, ctx) => {
    return queryEntity('cevalgrid', req, res, ctx)
  },
  local_cveteval_get_role: (req, res, ctx) => {
    return queryEntity('role', req, res, ctx)
  },
  local_cveteval_get_group_assign: (req, res, ctx) => {
    return queryEntity('group_assign', req, res, ctx)
  },
  local_cveteval_get_latest_modifications: (req, res, ctx) => {
    // @ts-ignore
    const { wstoken, entitytype, query } = req.body as any
    const decodedQuery = decodeURIComponent(query)
    const selectedEntities = getEntities(entitytype, decodedQuery)
    const latestModificationDate = selectedEntities.reduce(
      (acc, e) => (acc > e.timemodified ? acc : e.timemodified),
      0
    )
    return res(ctx.json({ latestmodifications: latestModificationDate }))
  },
  local_cveteval_submit_appraisal: (req, res, ctx) => {
    // Eval is evil but really practical here :)
    let {
      id,
      studentid,
      appraiserid,
      evalplanid,
      context,
      contextformat,
      comment,
      commentformat,
      usermodified,
      timemodified,
      timecreated,
    } = req.body as any
    if (id) {
      id = parseInt(id, 10)
    }
    if (!usermodified) {
      usermodified = 1
    } else {
      usermodified = parseInt(usermodified, 10)
    }
    if (!timecreated) {
      timecreated = Math.ceil(Date.now() / 1000)
    } else {
      timecreated = parseInt(timecreated, 10)
    }
    if (!timemodified) {
      timemodified = Math.ceil(Date.now() / 1000)
    } else {
      timemodified = parseInt(timemodified, 10)
    }
    studentid = parseInt(studentid, 10)
    appraiserid = parseInt(appraiserid, 10)
    evalplanid = parseInt(evalplanid, 10)

    const appraisalmodel = {
      id,
      studentid,
      appraiserid,
      evalplanid,
      context,
      contextformat,
      comment,
      commentformat,
      usermodified,
      timemodified,
      timecreated,
    }
    if (appraisalmodel.id) {
      const previousmodelIndex = entities.appraisal.findIndex(
        (app) => app.id === appraisalmodel.id
      )
      appraisalmodel.timemodified = Math.ceil(Date.now() / 1000)
      if (previousmodelIndex !== -1) {
        entities.appraisal[previousmodelIndex] = appraisalmodel
      } else {
        entities.appraisal.push(appraisalmodel)
      }
    } else {
      appraisalmodel.id = entities.appraisal.length + 1
      appraisalmodel.timecreated = Math.ceil(Date.now() / 1000)
      appraisalmodel.timemodified = Math.ceil(Date.now() / 1000)
      appraisalmodel.usermodified = 1
      entities.appraisal.push(appraisalmodel)
    }
    return res(
      ctx.json({
        ...appraisalmodel,
      })
    )
  },
  local_cveteval_submit_appraisal_criteria: (req, res, ctx) => {
    // Eval is evil but really practical here :)
    const { appraisalcriteriamodels } = Object.entries(req.body).reduce(
      (acc, [key, val]) => {
        if (isNumeric(val)) {
          val = Number(val)
        }
        parseFormDataVariable(acc, key, val)
        return acc
      },
      {}
    ) as any
    const returnedEntities = []
    appraisalcriteriamodels.forEach((apprcritModel) => {
      if (apprcritModel.id) {
        const previousmodelIndex = entities.appr_crit.findIndex(
          (app) => app.id === apprcritModel.id
        )
        apprcritModel.timemodified = Math.ceil(Date.now() / 1000)
        if (previousmodelIndex === -1) {
          entities.appr_crit.push(apprcritModel)
        } else {
          entities.appr_crit[previousmodelIndex] = apprcritModel
        }
      } else {
        apprcritModel.timecreated = Math.ceil(Date.now() / 1000)
        apprcritModel.timemodified = Math.ceil(Date.now() / 1000)
        apprcritModel.usermodified = 1
        apprcritModel.id = entities.appr_crit.length + 1
        entities.appr_crit.push(apprcritModel)
      }
      returnedEntities.push(apprcritModel)
    })
    return res(ctx.json([...returnedEntities]))
  },
}

export const handlers = [
  rest.post(
    'https://moodle.local/local/cveteval/login/token.php',
    (req, res, ctx) => {
      const { username, password } = req.body as any
      const returnValue: any = {}

      const foundUser = allUsers.find((u) => u.username === username)
      if (
        username &&
        password &&
        foundUser &&
        foundUser.password === password
      ) {
        returnValue.token = foundUser.token
        currentUserId = foundUser.userid
      } else {
        returnValue.errorcode = 'wronguser'
      }
      return res(ctx.json(returnValue))
    }
  ),
  rest.post(
    'https://moodle.local/webservice/rest/server.php',
    (req, res, ctx) => {
      const { wsfunction } = req.body as any
      if (restServerCallback.hasOwnProperty(wsfunction)) {
        return restServerCallback[wsfunction](req, res, ctx)
      } else {
        return res(
          ctx.status(400),
          ctx.json({ error: 'Method not implemented in mocks' })
        )
      }
    }
  ),
  rest.get(
    'https://moodle.local/local/cveteval/login/service-nologin.php',
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            data: [
              {
                url: 'http://cas.local/',
                name: 'CAS Test',
              },
            ],
          },
        ])
      )
    }
  ),
]
