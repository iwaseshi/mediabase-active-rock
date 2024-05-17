import { TerraformOutput, TerraformStack } from "cdktf"
import { Playlist, PlaylistConfig } from "../.gen/providers/spotify/playlist"

export function playlist(stack: TerraformStack, trackIds: string[]) {
  const spotifyPlaylist = new Playlist(stack, "mediabase_active_rock", <
    PlaylistConfig
  >{
    name: title(),
    description: "MEDIABASE Active Rock chart Past 7 Days",
    public: true,
    tracks: trackIds,
  })

  new TerraformOutput(stack, "playlist_url", {
    value: `https://open.spotify.com/playlist/${spotifyPlaylist.id}`,
  })
}

function title(): string {
  const now = new Date()
  const formattedNow = `${now
    .toLocaleString("default", { month: "short" })
    .toLowerCase()}${now.getDate()}`
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const formattedNextWeek = `${nextWeek
    .toLocaleString("default", { month: "short" })
    .toLowerCase()}${nextWeek.getDate()}`
  return `MEDIABASE Active Rock chart ${formattedNow} - ${formattedNextWeek}`
}
