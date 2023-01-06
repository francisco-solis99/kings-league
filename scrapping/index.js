import * as cheerio from 'cheerio'

const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

async function scrape (url) {
  const response = await fetch(url)
  const html = await response.text()
  return cheerio.load(html)
}

async function getLeaderBoard () {
  const $ = await scrape(URLS.leaderboard)
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    team: '.fs-table-text_3',
    wins: '.fs-table-text_4',
    loses: '.fs-table-text_5',
    scoredGoals: '.fs-table-text_6',
    concededGoals: '.fs-table-text_7',
    yellowCards: '.fs-table-text_8',
    redCards: '.fs-table-text_9'
  }

  const cleanText = text => text.replace(/\t|\n|\s:/g, '').replace(/.*:/g, ' ').trim()

  $rows.each((index, el) => {
    const leaderBoardEntries = Object.entries(LEADERBOARD_SELECTORS).map(([key, selector]) => {
      const rawValue = $(el).find(selector).text()
      const value = cleanText(rawValue)
      return [key, value]
    })

    console.log(Object.fromEntries(leaderBoardEntries))
  })
}

await getLeaderBoard()

// const leaderboard = [{
//   team: 'Team 1',
//   wins: 0,
//   loses: 0,
//   goalsScored: 0,
//   goalsConceded: 0,
//   cardsYellow: 0,
//   cardsRed: 0
// }]
