import * as FileSystem from 'expo-file-system';
import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { encode } from './tokenizer';
import { phonemize } from "../phonemize/index";
import floatArrayToWAV from '../wav';

const SAMPLE_RATE = 22050;

export class Vits {
  session: InferenceSession;

  constructor(session: InferenceSession) {
    this.session = session;
  }

  static async from_checkpoint(checkpoint_path: string): Promise<Vits> {
    const options = {
      graphOptimizationLevel: 'all',
      enableCpuMemArena: true,
      enableMemPattern: true,
      executionMode: 'sequential'
    } as InferenceSession.SessionOptions;

    const session = await InferenceSession.create(
      checkpoint_path,
      options
    );

    return new Vits(session);
  }

  async generate(text: string, outputPath: string): Promise<void> {
    // 1. Phonemize input text
    const phonemes = phonemize(text);

    // 2. Tokenize phonemes into IDs
    const tokens = encode(phonemes);
    const lengths = [tokens.length];

    // 3. Build tensors for inputs
    const input_ids = new Tensor("int64", BigInt64Array.from(tokens.map(BigInt)), [
      1,
      tokens.length,
    ]);
    const input_lengths = new Tensor("int64", BigInt64Array.from(lengths.map(BigInt)), [
      lengths.length,
    ]);
    const scales = new Tensor("float32", new Float32Array([0.667, 1.0, 0.8]), [3]);

    const inputs: Record<string, Tensor> = {
      input: input_ids,
      input_lengths: input_lengths,
      scales: scales,
    };

    // 4. Run inference
    const outputs = await this.session.run(inputs);
    const waveform = outputs["output"]?.data as Float32Array | undefined;

    if (!waveform) {
      throw new Error("Invalid output from model inference");
    }

    // 5. Convert float PCM → WAV
    const wav = floatArrayToWAV(waveform, SAMPLE_RATE);

    // 6. Write to disk as Base64 WAV
    await FileSystem.writeAsStringAsync(outputPath, wav, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }
}