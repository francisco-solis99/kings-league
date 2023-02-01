import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'

const app = new Hono()

app.get('/', ctx => {
  return ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the leaderboard'
    },
    {
      endpoint: '/teams',
      description: 'Returns the teams'
    },
    {
      endpoint: '/presidents',
      description: 'Returns the presidents'
    }
  ])
})

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})

app.get('/presidents/:id', (ctx) => {
  const id = ctx.req.param('id')
  const presidentFound = presidents.find(president => president.id === id)
  return presidentFound ? ctx.json(presidentFound) : { message: 'president not found' }
})

// Static server for images
app.get('/static/*', serveStatic({ root: './' }))

export default app
