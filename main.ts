import { App, TerraformStack, Token } from "cdktf";
import { Construct } from "constructs";
import { playlist } from "./module/playlist";
import { SpotifyProvider } from "./.gen/providers/spotify/provider";
import { track } from "./module/track";
import { config as dotenvConfig } from "dotenv";

class MySpotifyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new SpotifyProvider(this, "spotify", {
      apiKey: Token.asString(process.env.SPOTIFY_API_KEY),
    });

    const trackIds = track(this);
    playlist(this, trackIds);
  }
}

dotenvConfig();
const app = new App();
new MySpotifyStack(app, "mediabase-active-rock");
app.synth();
