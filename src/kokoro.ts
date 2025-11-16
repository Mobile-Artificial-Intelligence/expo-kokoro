import * as FileSystem from 'expo-file-system';
import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { tokenizer } from "./tokenizer";
import { load_voice_data, KokoroVoice } from "./voices";
import floatArrayToWAV from "./wav";
import { DeepPhonemizer } from 'expo-deep-phonemizer';
import { Asset } from 'expo-asset';
import { chooseLanguage } from './language_chooser';

const SAMPLE_RATE = 24000;
const STYLE_DIM = 256;
const MAX_PHONEME_LENGTH = 510;

export class Kokoro {
  phonemizer: DeepPhonemizer;
  session: InferenceSession;

  constructor(session: InferenceSession, phonemizer: DeepPhonemizer) {
    this.session = session;
    this.phonemizer = phonemizer;
  }

  static async load(): Promise<Kokoro> {
    const asset = Asset.fromModule(require('./kokoro-quantized.onnx'));
    if (!asset.downloaded) {
      console.log("Downloading Kokoro model...");
      await asset.downloadAsync();
    }

    const modelPath = asset.localUri ?? asset.uri;
    const options = {
      graphOptimizationLevel: 'all',
      enableCpuMemArena: true,
      enableMemPattern: true,
      executionMode: 'sequential'
    } as InferenceSession.SessionOptions;

    const session = await InferenceSession.create(
      modelPath,
      options
    );

    const phonemizer = await DeepPhonemizer.load();

    return new Kokoro(session, phonemizer);
  }

  async generate(text: string, voice: KokoroVoice, outputPath: string): Promise<void> {
    const language = chooseLanguage(voice);
    const phonemes = await this.phonemizer.phonemize(text, language, true);
    const tokens = tokenizer.encode(phonemes);
    const n_tokens = Math.min(Math.max(tokens.length - 2, 0), MAX_PHONEME_LENGTH - 1);
    const offset = n_tokens * STYLE_DIM;

    const voice_data = await load_voice_data(voice);
    const style_data = voice_data.slice(offset, offset + STYLE_DIM);

    const inputs = {
      input_ids: new Tensor('int64', tokens, [1, tokens.length]),
      style: new Tensor('float32', new Float32Array(style_data), [1, STYLE_DIM]),
      speed: new Tensor('float32', new Float32Array([1.0]), [1])
    }

    const outputs = await this.session.run(inputs);

    if (!outputs || !outputs['waveform'] || !outputs['waveform'].data) {
      throw new Error('Invalid output from model inference');
    }
      
    const data = outputs['waveform'].data as Float32Array;
    const wav = floatArrayToWAV(data, SAMPLE_RATE);

    await FileSystem.writeAsStringAsync(
      outputPath, 
      wav, 
      { encoding: FileSystem.EncodingType.Base64 }
    );
  }
}