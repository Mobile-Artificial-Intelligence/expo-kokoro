import { Asset } from "expo-asset";

export enum Voice {
    // American Female
    Alloy = "alloy",
    Aoede = "aoede",
    Bella = "bella",
    Heart = "heart",
    Jessica = "jessica",
    Kore = "kore",
    Nicole = "nicole",
    Nova = "nova",
    River = "river",
    Sarah = "sarah",
    Sky = "sky",
    
    // American Male
    Adam = "adam",
    Echo = "echo",
    Eric = "eric",
    Fenrir = "fenrir",
    Liam = "liam",
    Michael = "michael",
    Onyx = "onyx",
    Puck = "puck",
    Santa = "santa",

    // British Female
    Alice = "alice",
    Emma = "emma",
    Isabella = "isabella",
    Lily = "lily",

    // British Male
    Daniel = "daniel",
    Fable = "fable",
    George = "george",
    Lewis = "lewis",
}

const VOICE_ASSETS: Record<Voice, number> = {
    [Voice.Alloy]: require("./voices/af_alloy.bin"),
    [Voice.Aoede]: require("./voices/af_aoede.bin"),
    [Voice.Bella]: require("./voices/af_bella.bin"),
    [Voice.Heart]: require("./voices/af_heart.bin"),
    [Voice.Jessica]: require("./voices/af_jessica.bin"),
    [Voice.Kore]: require("./voices/af_kore.bin"),
    [Voice.Nicole]: require("./voices/af_nicole.bin"),
    [Voice.Nova]: require("./voices/af_nova.bin"),
    [Voice.River]: require("./voices/af_river.bin"),
    [Voice.Sarah]: require("./voices/af_sarah.bin"),
    [Voice.Sky]: require("./voices/af_sky.bin"),
    [Voice.Adam]: require("./voices/am_adam.bin"),
    [Voice.Echo]: require("./voices/am_echo.bin"),
    [Voice.Eric]: require("./voices/am_eric.bin"),
    [Voice.Fenrir]: require("./voices/am_fenrir.bin"),
    [Voice.Liam]: require("./voices/am_liam.bin"),
    [Voice.Michael]: require("./voices/am_michael.bin"),
    [Voice.Onyx]: require("./voices/am_onyx.bin"),
    [Voice.Puck]: require("./voices/am_puck.bin"),
    [Voice.Santa]: require("./voices/am_santa.bin"),
    [Voice.Alice]: require("./voices/bf_alice.bin"),
    [Voice.Emma]: require("./voices/bf_emma.bin"),
    [Voice.Isabella]: require("./voices/bf_isabella.bin"),
    [Voice.Lily]: require("./voices/bf_lily.bin"),
    [Voice.Daniel]: require("./voices/bm_daniel.bin"),
    [Voice.Fable]: require("./voices/bm_fable.bin"),
    [Voice.George]: require("./voices/bm_george.bin"),
    [Voice.Lewis]: require("./voices/bm_lewis.bin"),
};

export async function load_voice_data(voice: Voice): Promise<Uint8Array> {
    const asset = Asset.fromModule(VOICE_ASSETS[voice]);

    if (!asset.downloaded) {
      await asset.downloadAsync();
    }

    const uri = asset.localUri ?? asset.uri;
    const res = await fetch(uri);
    const buf = await res.arrayBuffer();

    return new Uint8Array(buf);
}
