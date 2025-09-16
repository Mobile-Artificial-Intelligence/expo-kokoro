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
    [Voice.Alloy]: require("../../assets/voices/af_alloy.bin"),
    [Voice.Aoede]: require("../../assets/voices/af_aoede.bin"),
    [Voice.Bella]: require("../../assets/voices/af_bella.bin"),
    [Voice.Heart]: require("../../assets/voices/af_heart.bin"),
    [Voice.Jessica]: require("../../assets/voices/af_jessica.bin"),
    [Voice.Kore]: require("../../assets/voices/af_kore.bin"),
    [Voice.Nicole]: require("../../assets/voices/af_nicole.bin"),
    [Voice.Nova]: require("../../assets/voices/af_nova.bin"),
    [Voice.River]: require("../../assets/voices/af_river.bin"),
    [Voice.Sarah]: require("../../assets/voices/af_sarah.bin"),
    [Voice.Sky]: require("../../assets/voices/af_sky.bin"),
    [Voice.Adam]: require("../../assets/voices/am_adam.bin"),
    [Voice.Echo]: require("../../assets/voices/am_echo.bin"),
    [Voice.Eric]: require("../../assets/voices/am_eric.bin"),
    [Voice.Fenrir]: require("../../assets/voices/am_fenrir.bin"),
    [Voice.Liam]: require("../../assets/voices/am_liam.bin"),
    [Voice.Michael]: require("../../assets/voices/am_michael.bin"),
    [Voice.Onyx]: require("../../assets/voices/am_onyx.bin"),
    [Voice.Puck]: require("../../assets/voices/am_puck.bin"),
    [Voice.Santa]: require("../../assets/voices/am_santa.bin"),
    [Voice.Alice]: require("../../assets/voices/bf_alice.bin"),
    [Voice.Emma]: require("../../assets/voices/bf_emma.bin"),
    [Voice.Isabella]: require("../../assets/voices/bf_isabella.bin"),
    [Voice.Lily]: require("../../assets/voices/bf_lily.bin"),
    [Voice.Daniel]: require("../../assets/voices/bm_daniel.bin"),
    [Voice.Fable]: require("../../assets/voices/bm_fable.bin"),
    [Voice.George]: require("../../assets/voices/bm_george.bin"),
    [Voice.Lewis]: require("../../assets/voices/bm_lewis.bin"),
};

export async function load_voice_data(voice: Voice): Promise<Float32Array> {
    const asset = Asset.fromModule(VOICE_ASSETS[voice]);

    if (!asset.downloaded) {
      await asset.downloadAsync();
    }

    const uri = asset.localUri ?? asset.uri;
    const res = await fetch(uri);
    const buf = await res.arrayBuffer();

    return new Float32Array(buf);
}
