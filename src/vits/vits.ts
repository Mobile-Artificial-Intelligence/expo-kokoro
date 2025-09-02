import * as FileSystem from 'expo-file-system';
import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { encode } from './tokenizer';
import { phonemize } from 'phonemize';

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
    const phonemes = phonemize(text);
    const tokens = encode(phonemes);
  }
}