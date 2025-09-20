import { Asset } from "expo-asset";

export const KokoroVoices = [
  // American Female
  "alloy",
  "aoede",
  "bella",
  "heart",
  "jessica",
  "kore",
  "nicole",
  "nova",
  "river",
  "sarah",
  "sky",

  // American Male
  "adam",
  "echo",
  "eric",
  "fenrir",
  "liam",
  "michael",
  "onyx",
  "puck",
  "santa",

  // British Female
  "alice",
  "emma",
  "isabella",
  "lily",

  // British Male
  "daniel",
  "fable",
  "george",
  "lewis",

  // Foreign Female/Male
  "siwis",

  // Human/Hybrid weirdos
  "alpha",
  "beta",
  "omega",
  "psi",

  // Italian Female/Male
  "sara",
  "nicola",

  // Japanese Female/Male
  "jf_alpha",
  "gongitsune",
  "nezumi",
  "tebukuro",
  "kumo",

  // Portuguese Female/Male
  "dora",
  "alex",

  // Chinese Female/Male
  "xiaobei",
  "xiaoni",
  "xiaoxiao",
  "xiaoyi",
  "yunjian",
  "yunxi",
  "yunxia",
  "yunyang"
] as const;

export type KokoroVoice = typeof KokoroVoices[number];

const VOICE_ASSETS: Record<KokoroVoice, number> = {
  // American Female
  alloy: require("../../assets/tts/voices/af_alloy.bin"),
  aoede: require("../../assets/tts/voices/af_aoede.bin"),
  bella: require("../../assets/tts/voices/af_bella.bin"),
  heart: require("../../assets/tts/voices/af_heart.bin"),
  jessica: require("../../assets/tts/voices/af_jessica.bin"),
  kore: require("../../assets/tts/voices/af_kore.bin"),
  nicole: require("../../assets/tts/voices/af_nicole.bin"),
  nova: require("../../assets/tts/voices/af_nova.bin"),
  river: require("../../assets/tts/voices/af_river.bin"),
  sarah: require("../../assets/tts/voices/af_sarah.bin"),
  sky: require("../../assets/tts/voices/af_sky.bin"),

  // American Male
  adam: require("../../assets/tts/voices/am_adam.bin"),
  echo: require("../../assets/tts/voices/am_echo.bin"),
  eric: require("../../assets/tts/voices/am_eric.bin"),
  fenrir: require("../../assets/tts/voices/am_fenrir.bin"),
  liam: require("../../assets/tts/voices/am_liam.bin"),
  michael: require("../../assets/tts/voices/am_michael.bin"),
  onyx: require("../../assets/tts/voices/am_onyx.bin"),
  puck: require("../../assets/tts/voices/am_puck.bin"),
  santa: require("../../assets/tts/voices/am_santa.bin"),

  // British Female
  alice: require("../../assets/tts/voices/bf_alice.bin"),
  emma: require("../../assets/tts/voices/bf_emma.bin"),
  isabella: require("../../assets/tts/voices/bf_isabella.bin"),
  lily: require("../../assets/tts/voices/bf_lily.bin"),

  // British Male
  daniel: require("../../assets/tts/voices/bm_daniel.bin"),
  fable: require("../../assets/tts/voices/bm_fable.bin"),
  george: require("../../assets/tts/voices/bm_george.bin"),
  lewis: require("../../assets/tts/voices/bm_lewis.bin"),

  // Foreign Female
  siwis: require("../../assets/tts/voices/ff_siwis.bin"),

  // Hybrid freak show
  alpha: require("../../assets/tts/voices/hf_alpha.bin"),
  beta: require("../../assets/tts/voices/hf_beta.bin"),
  omega: require("../../assets/tts/voices/hm_omega.bin"),
  psi: require("../../assets/tts/voices/hm_psi.bin"),

  // Italian
  sara: require("../../assets/tts/voices/if_sara.bin"),
  nicola: require("../../assets/tts/voices/im_nicola.bin"),

  // Japanese
  jf_alpha: require("../../assets/tts/voices/jf_alpha.bin"),
  gongitsune: require("../../assets/tts/voices/jf_gongitsune.bin"),
  nezumi: require("../../assets/tts/voices/jf_nezumi.bin"),
  tebukuro: require("../../assets/tts/voices/jf_tebukuro.bin"),
  kumo: require("../../assets/tts/voices/jm_kumo.bin"),

  // Portuguese
  dora: require("../../assets/tts/voices/pf_dora.bin"),
  alex: require("../../assets/tts/voices/pm_alex.bin"),

  // Chinese
  xiaobei: require("../../assets/tts/voices/zf_xiaobei.bin"),
  xiaoni: require("../../assets/tts/voices/zf_xiaoni.bin"),
  xiaoxiao: require("../../assets/tts/voices/zf_xiaoxiao.bin"),
  xiaoyi: require("../../assets/tts/voices/zf_xiaoyi.bin"),
  yunjian: require("../../assets/tts/voices/zm_yunjian.bin"),
  yunxi: require("../../assets/tts/voices/zm_yunxi.bin"),
  yunxia: require("../../assets/tts/voices/zm_yunxia.bin"),
  yunyang: require("../../assets/tts/voices/zm_yunyang.bin"),
};

export async function load_voice_data(voice: KokoroVoice): Promise<Float32Array> {
  const asset = Asset.fromModule(VOICE_ASSETS[voice]);
  if (!asset.downloaded) {
    await asset.downloadAsync();
  }
  const uri = asset.localUri ?? asset.uri;
  const res = await fetch(uri);
  const buf = await res.arrayBuffer();
  return new Float32Array(buf);
}
