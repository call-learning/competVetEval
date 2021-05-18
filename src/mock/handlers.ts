import { rest } from 'msw'
import allUsers from './fixtures/users'
import criterion from './fixtures/criterion'
import situations from './fixtures/situations'
import groups from './fixtures/groups'
import evalplan from './fixtures/evalplan'
import groupassign from './fixtures/groupassign'
import role from './fixtures/role'
import cevalgrid from './fixtures/cevalgrid'
import apprcrit from './fixtures/apprcrit'
import appr from './fixtures/appr'

export const handlers = [
  rest.post('https://moodle.local/login/token.php', (req, res, ctx) => {
    const { username, password } = req.body as any
    let returnValue = {}

    const foundUser = allUsers.find((u) => u.username == username)
    if (username && password && foundUser && foundUser.password === password) {
      returnValue['token'] = foundUser.token
    } else {
      returnValue['errorcode'] = 'wronguser'
    }
    return res(ctx.json(returnValue))
  }),
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
]

const parseFormDataVariable = (currentObj, key, val) => {
  const keyValue = [...key.matchAll(/(\w+)(?=\[(\w+)\])*/g)]
  let currentVariable = currentObj
  keyValue.forEach((value, index, originalArray) => {
    // Look ahead to check the variable type.
    const isNumericIndex =
      index + 1 < originalArray.length
        ? !isNaN(originalArray[index + 1][0])
        : false
    const currentIndex = isNaN(value[0]) ? value[0] : parseInt(value[0])

    if (!currentVariable[currentIndex]) {
      currentVariable[currentIndex] = isNumericIndex ? [] : {}
    }
    if (index == keyValue.length - 1) {
      currentVariable[currentIndex] = val
    }
    currentVariable = currentVariable[currentIndex]
  })
}

const entities = {
  criterion: criterion,
  clsituation: situations,
  group_assign: groupassign,
  group: groups,
  role: role,
  evalplan: evalplan,
  cevalgrid: cevalgrid,
  appraisal: appr,
  appr_crit: apprcrit,
}

const queryEntity = (entityType, req, res, ctx) => {
  const { query } = req.body as any
  let returnedEntities = getEntities(entityType, query)

  return res(ctx.json(returnedEntities))
}

const getEntities = (entitytype, queryJSON) => {
  let returnedEntities = []
  if (entities[entitytype]) {
    returnedEntities = entities[entitytype]
    if (queryJSON) {
      const query = JSON.parse(queryJSON)
      returnedEntities = returnedEntities.filter((e) => {
        let isMacthing = true
        for (let property in query) {
          if (e[property] != query[property]) {
            isMacthing = false
          }
        }
        return isMacthing
      })
    }
  }
  return returnedEntities
}

const restServerCallback = {
  core_webservice_get_site_info: (req, res, ctx) => {
    const { wstoken } = req.body as any
    const foundUser = allUsers.find((u) => u.token == wstoken)
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
    const foundUser = allUsers.find((u) => u.token == wstoken)
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
    const { userid } = req.body as any
    const foundUser = allUsers.find((u) => u.userid == userid)
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
    const { wstoken, entitytype, query } = req.body as any
    const selectedEntities = getEntities(entitytype, query)
    const latestModificationDate = selectedEntities.reduce(
      (acc, e) => (acc > e.timemodified ? acc : e.timemodified),
      0
    )
    return res(ctx.json(latestModificationDate))
  },
  local_cveteval_submit_appraisal: (req, res, ctx) => {
    // Eval is evil but really practical here :)
    let { appraisalmodel } = Object.entries(req.body).reduce(
      (acc, [key, val]) => {
        parseFormDataVariable(acc, key, val)
        return acc
      },
      {}
    ) as any

    if (appraisalmodel.id) {
      const previousmodel = entities['appraisal'].find(
        (app) => (app.id = appraisalmodel.id)
      )
      appraisalmodel.timemodified = Math.ceil(Date.now() / 1000)
      Object.assign(previousmodel, appraisalmodel)
    } else {
      appraisalmodel.id = entities['appraisal'].length
      appraisalmodel.timecreated = Math.ceil(Date.now() / 1000)
      appraisalmodel.timemodified = Math.ceil(Date.now() / 1000)
      appraisalmodel.usermodified = 1
      entities['appraisal'].push(appraisalmodel)
    }
    return res(
      ctx.json({
        ...appraisalmodel,
      })
    )
  },
  local_cveteval_submit_appraisal_criteria: (req, res, ctx) => {
    // Eval is evil but really practical here :)
    const { appraisalcriteriamodel } = Object.entries(req.body).reduce(
      (acc, [key, val]) => {
        parseFormDataVariable(acc, key, val)
        return acc
      },
      {}
    ) as any
    let returnedEntities = []
    appraisalcriteriamodel.forEach((apprcrit) => {
      if (apprcrit.id) {
        const previousmodel = entities['appr_crit'].find(
          (app) => (app.id = apprcrit.id)
        )
        apprcrit.timemodified = Math.ceil(Date.now() / 1000)
        Object.assign(previousmodel, apprcrit)
      } else {
        apprcrit.timecreated = Math.ceil(Date.now() / 1000)
        apprcrit.timemodified = Math.ceil(Date.now() / 1000)
        apprcrit.usermodified = 1
        apprcrit.id = entities['appr_crit'].length
        entities['appr_crit'].push(apprcrit)
      }
      returnedEntities.push(apprcrit)
    })
    entities['appr_crit'].concat(returnedEntities)
    return res(ctx.json([...returnedEntities]))
  },
}
