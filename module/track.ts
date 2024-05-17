import { TerraformStack } from "cdktf"
import { DataSpotifySearchTrack } from "../.gen/providers/spotify/data-spotify-search-track"
import { parseRockChart } from "../script/parse"

export const track = async (stack: TerraformStack): Promise<string[]> => {
  const { artistSongs, artistsOrder } = await parseRockChart()

  const ids: string[] = []

  for (let i = 0; i < artistsOrder.length; i++) {
    const artist = artistsOrder[i]
    const name = artistSongs.get(artist)
    if (artist && name) {
      const track = new DataSpotifySearchTrack(stack, `search_tracks${i}`, {
        artist,
        name,
      })

      if (track.tracks) {
        ids.push(track.tracks.get(0).id)
      } else {
        console.log(`No tracks found for ${artist}`)
      }
    }
  }
  return ids
}
