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

// Leaderboard
app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

// Teams
app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

// Team by id
app.get('/teams/:id', (ctx) => {
  const id = ctx.req.param('id')
  const foundTeam = teams.find(team => team.id === id)

  return foundTeam
    ? ctx.json(foundTeam)
    : ctx.json({ message: 'Team not found' }, 404)
})

// President by id
app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})

// One president
app.get('/presidents/:id', (ctx) => {
  const id = ctx.req.param('id')
  const presidentFound = presidents.find(president => president.id === id)
  return presidentFound ? ctx.json(presidentFound) : ctx.json({ message: 'president not found' }, 404)
})

// Static server for images
app.get('/static/*', serveStatic({ root: './' }))

export default app
