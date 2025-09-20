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
  alloy: require("../../assets/voices/af_alloy.bin"),
  aoede: require("../../assets/voices/af_aoede.bin"),
  bella: require("../../assets/voices/af_bella.bin"),
  heart: require("../../assets/voices/af_heart.bin"),
  jessica: require("../../assets/voices/af_jessica.bin"),
  kore: require("../../assets/voices/af_kore.bin"),
  nicole: require("../../assets/voices/af_nicole.bin"),
  nova: require("../../assets/voices/af_nova.bin"),
  river: require("../../assets/voices/af_river.bin"),
  sarah: require("../../assets/voices/af_sarah.bin"),
  sky: require("../../assets/voices/af_sky.bin"),

  // American Male
  adam: require("../../assets/voices/am_adam.bin"),
  echo: require("../../assets/voices/am_echo.bin"),
  eric: require("../../assets/voices/am_eric.bin"),
  fenrir: require("../../assets/voices/am_fenrir.bin"),
  liam: require("../../assets/voices/am_liam.bin"),
  michael: require("../../assets/voices/am_michael.bin"),
  onyx: require("../../assets/voices/am_onyx.bin"),
  puck: require("../../assets/voices/am_puck.bin"),
  santa: require("../../assets/voices/am_santa.bin"),

  // British Female
  alice: require("../../assets/voices/bf_alice.bin"),
  emma: require("../../assets/voices/bf_emma.bin"),
  isabella: require("../../assets/voices/bf_isabella.bin"),
  lily: require("../../assets/voices/bf_lily.bin"),

  // British Male
  daniel: require("../../assets/voices/bm_daniel.bin"),
  fable: require("../../assets/voices/bm_fable.bin"),
  george: require("../../assets/voices/bm_george.bin"),
  lewis: require("../../assets/voices/bm_lewis.bin"),

  // Foreign Female
  siwis: require("../../assets/voices/ff_siwis.bin"),

  // Hybrid freak show
  alpha: require("../../assets/voices/hf_alpha.bin"),
  beta: require("../../assets/voices/hf_beta.bin"),
  omega: require("../../assets/voices/hm_omega.bin"),
  psi: require("../../assets/voices/hm_psi.bin"),

  // Italian
  sara: require("../../assets/voices/if_sara.bin"),
  nicola: require("../../assets/voices/im_nicola.bin"),

  // Japanese
  jf_alpha: require("../../assets/voices/jf_alpha.bin"),
  gongitsune: require("../../assets/voices/jf_gongitsune.bin"),
  nezumi: require("../../assets/voices/jf_nezumi.bin"),
  tebukuro: require("../../assets/voices/jf_tebukuro.bin"),
  kumo: require("../../assets/voices/jm_kumo.bin"),

  // Portuguese
  dora: require("../../assets/voices/pf_dora.bin"),
  alex: require("../../assets/voices/pm_alex.bin"),

  // Chinese
  xiaobei: require("../../assets/voices/zf_xiaobei.bin"),
  xiaoni: require("../../assets/voices/zf_xiaoni.bin"),
  xiaoxiao: require("../../assets/voices/zf_xiaoxiao.bin"),
  xiaoyi: require("../../assets/voices/zf_xiaoyi.bin"),
  yunjian: require("../../assets/voices/zm_yunjian.bin"),
  yunxi: require("../../assets/voices/zm_yunxi.bin"),
  yunxia: require("../../assets/voices/zm_yunxia.bin"),
  yunyang: require("../../assets/voices/zm_yunyang.bin"),
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
