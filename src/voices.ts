import { Asset } from "expo-asset";

export enum Voice {
    Bella = "bella",
    Nicole = "nicole",
    Sarah = "sarah",
    Sky = "sky",
    Af = "af",
    Adam = "adam",
    Michael = "michael",
    Emma = "emma",
    Isabella = "isabella",
    George = "george",
    Lewis = "lewis"
}

const VOICE_ASSETS: Record<Voice, number> = {
    [Voice.Bella]: require("./voices/af_bella.bin"),
    [Voice.Nicole]: require("./voices/af_nicole.bin"),
    [Voice.Sarah]: require("./voices/af_sarah.bin"),
    [Voice.Sky]: require("./voices/af_sky.bin"),
    [Voice.Af]: require("./voices/af.bin"),
    [Voice.Adam]: require("./voices/am_adam.bin"),
    [Voice.Michael]: require("./voices/am_michael.bin"),
    [Voice.Emma]: require("./voices/bf_emma.bin"),
    [Voice.Isabella]: require("./voices/bf_isabella.bin"),
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
