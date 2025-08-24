import { InferenceSession } from "onnxruntime-react-native";
import tokenizer from "./tokenizer";
import { loadVoiceBytes, Voice } from "./voices";

export class Kokoro {
  session: InferenceSession;

  constructor(session: InferenceSession) {
    this.session = session;
  }

  static async from_checkpoint(checkpoint_path: string): Promise<Kokoro> {
    const session = await InferenceSession.create(checkpoint_path);
    return new Kokoro(session);
  }

  async generate(text: string, voice: Voice): Promise<unknown> {
    const input_ids = tokenizer.encode(text);
    const voice_bytes = await loadVoiceBytes(voice);
    
    return;
  }
}