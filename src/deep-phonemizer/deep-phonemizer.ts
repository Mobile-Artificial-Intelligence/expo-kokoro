import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { encode, decode } from './tokenizer';

export class DeepPhonemizer {
    session: InferenceSession;

    constructor(session: InferenceSession) {
        this.session = session;
    }

    static async from_checkpoint(checkpoint_path: string): Promise<DeepPhonemizer> {
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
    
        return new DeepPhonemizer(session);
    }

    async phonemize(text: string, lang: string = "en_us"): Promise<string> {
        const tokens = encode(text, lang);
    }
}