import { InferenceSession, Tensor } from "onnxruntime-react-native";
import { encode, decode } from './tokenizer';
import { Asset } from 'expo-asset';

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

    static async default(): Promise<DeepPhonemizer> {
        const asset = Asset.fromModule(require('./deep-phonemizer.onnx'));
        if (!asset.downloaded) {
          console.log("Downloading model asset...");
          await asset.downloadAsync();
        }

        const modelPath = asset.localUri ?? asset.uri;
        console.log("Model path:", modelPath);

        return DeepPhonemizer.from_checkpoint(modelPath);
    }

    async phonemize(text: string, lang: string = "en_us"): Promise<string> {
        const tokens = encode(text, lang);
        console.log(tokens);

        // If the tokens are smaller than 64 in lenth pad with zeros
        while (tokens.length < 64) {
            tokens.push(0);
        }

        const inputTensor = new Tensor("int64", BigInt64Array.from(tokens.map(BigInt)), [1, tokens.length]);
        const feeds: Record<string, Tensor> = { text: inputTensor };
        const results = await this.session.run(feeds);

        const outputTensor = results["output"];
        if (!outputTensor) {
            throw new Error("No output tensor from model");
        }

        const logits = outputTensor.data as Float32Array;

        // shape: [1, seq_len, vocab_size]
        const [_batch, seq, vocab] = outputTensor.dims;
        const outIds: number[] = [];
        for (let t = 0; t < seq; t++) {
          let maxIdx = 0;
          let maxVal = -Infinity;
          for (let v = 0; v < vocab; v++) {
            const val = logits[t * vocab + v];
            if (val > maxVal) {
              maxVal = val;
              maxIdx = v;
            }
          }
          outIds.push(maxIdx);
        }
        return decode(outIds);
    }
}