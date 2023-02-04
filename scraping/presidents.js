import * as cheerio from 'cheerio'
import { readFile, writeFile } from 'fs/promises'
import path from 'node:path'

const STATICS_PATH = path.join(process.cwd(), './assets/static/presidents')
const DB_PATH = path.join(process.cwd(), '/db')
const TEAMS = await readFile(`${DB_PATH}/teams.json`, 'utf-8').then(JSON.parse)

async function scrape (url) {
  const response = await fetch(url)
  const html = await response.text()
  return cheerio.load(html)
}

async function getPresidents () {
  return TEAMS.map(async team => {
    const $ = await scrape(`https://kingsleague.pro/team/${team.id}`)
    const presidentImageSrc = $('.uk-slider-items img').attr('src')
    const rawPresidentName = $('.uk-slider-items h3').first().text()
    const presidentName = rawPresidentName.trim()
    const idPresident = presidentName.replaceAll(' ', '-').replaceAll('.', '').toLowerCase()

    console.log(`Getting the president ${presidentName}`)

    const fileExtension = presidentImageSrc.split('.').at(-1)
    const responseImage = await fetch(presidentImageSrc)
    const arrayBuffer = await responseImage.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(`Writing image to disk ${presidentName}`)

    const imageFileName = `${team.id}.${fileExtension}`
    await writeFile(`${STATICS_PATH}/${imageFileName}`, buffer)

    console.log(`> Everything is done! ${presidentName}`)

    return {
      id: idPresident,
      name: presidentName,
      image: imageFileName,
      teamId: team.id
    }
  })
}

const presidentsPromises = await getPresidents()
const presidents = await Promise.all(presidentsPromises)

await writeFile(`${DB_PATH}/presidents.json`, JSON.stringify(presidents, null, 2))
