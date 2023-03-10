import * as cheerio from 'cheerio'
import { TEAMS, PRESIDENTS, writeDBFile } from '../db/index.js'

const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

// Function to scrape
async function scrape (url) {
  const response = await fetch(url)
  const html = await response.text()
  return cheerio.load(html)
}

async function getLeaderBoard () {
  const $ = await scrape(URLS.leaderboard)
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
    concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  // Function to clean teh text
  const cleanText = text => text.replace(/\t|\n|\s:/g, '').replace(/.*:/g, '')

  // Function to get teh team info object
  const getTeamFrom = ({ name }) => {
    const { presidentId, ...restOfTeam } = TEAMS.find(team => team.name === name)
    const president = PRESIDENTS.find(president => president.id === presidentId)
    return {
      ...restOfTeam,
      president
    }
  }

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)
  const leaderBoard = []
  $rows.each((_, el) => {
    const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $(el).find(selector).text()
      const cleanValue = cleanText(rawValue)
      const value = typeOf === 'number' ? Number(cleanValue) : cleanValue
      return [key, value]
    })

    const { team: teamName, ...leaderBoardForTeam } = Object.fromEntries(leaderBoardEntries)
    const team = getTeamFrom({ name: teamName })

    leaderBoard.push({
      team,
      ...leaderBoardForTeam
    })
  })
  return leaderBoard
}

const leaderBoard = await getLeaderBoard()
await writeDBFile('leaderboard', leaderBoard)

// const leaderboard = [{
//   team: 'Team 1',
//   wins: 0,
//   loses: 0,
//   goalsScored: 0,
//   goalsConceded: 0,
//   cardsYellow: 0,
//   cardsRed: 0
// }]
