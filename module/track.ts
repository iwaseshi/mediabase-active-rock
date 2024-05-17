import { TerraformStack } from "cdktf";
import { DataSpotifySearchTrack } from "../.gen/providers/spotify/data-spotify-search-track";

// 模擬のparse.RockChart関数。実際の実装に置き換えてください。
function fetchRockChart(): {
  artistSongs: Record<string, string>;
  artistsOrder: string[];
} {
  // 模擬データを返す
  return {
    artistSongs: {
      METALLICA: "Screaming Suicid",
      GODSMACK: "Truth",
      BEARTOOTH: "I Was Alive",
    },
    artistsOrder: ["METALLICA", "GODSMACK", "BEARTOOTH"],
  };
}

export function track(stack: TerraformStack): string[] {
  const { artistSongs, artistsOrder } = fetchRockChart();

  const ids: string[] = [];

  for (let i = 0; i < artistsOrder.length; i++) {
    const artist = artistsOrder[i];
    const name = artistSongs[artist];
    console.log(`${artist} - ${name}`);

    if (artist && name) {
      const track = new DataSpotifySearchTrack(stack, `search_tracks${i}`, {
        artist,
        name,
      });

      const tracks = track.tracks;
      if (tracks) {
        ids.push(tracks.get(0).id);
      }
    }
  }

  return ids;
}
