import puppeteer from "puppeteer"

interface RowData {
  artist: string
  song: string
}

export async function parseRockChart(): Promise<{
  artistSongs: Map<string, string>
  artistsOrder: string[]
}> {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  try {
    await page.goto(
      "http://www.mediabase.com/mmrweb/fmqb/charts.asp?format=6",
      { timeout: 60000, waitUntil: "load" }
    )

    await page.waitForSelector("div.report")

    const rows: RowData[] = await page.$$eval("div.report tbody tr", (trs) =>
      trs.map((tr) => {
        const tds = tr.querySelectorAll("td")
        return {
          artist: tds[3] ? (tds[3].textContent || "").trim() : "",
          song: tds[4] ? (tds[4].textContent || "").trim() : "",
        }
      })
    )

    const parseResults = rows.map((row) => ({
      artist: row.artist,
      song: row.song,
    }))

    const artistSongs = new Map<string, string>()
    const artistsOrder: string[] = []

    for (const result of parseResults) {
      const artist = result.artist
      if (!artistSongs.has(artist)) {
        artistsOrder.push(artist)
      }
      artistSongs.set(artist, result.song)
    }

    return { artistSongs, artistsOrder }
  } catch (error) {
    console.error(`parse failed :`, error)
    throw error
  } finally {
    await browser.close()
  }
}
