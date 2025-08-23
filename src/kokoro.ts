import { InferenceSession } from "onnxruntime-react-native";

export class Kokoro {
  session: InferenceSession;

  constructor(session: InferenceSession) {
    this.session = session;
  }

  static async from_checkpoint(checkpointPath: string): Promise<Kokoro> {
    const session = await InferenceSession.create(checkpointPath);
    return new Kokoro(session);
  }
}