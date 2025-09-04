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
        const tokenIds = encode(text, lang);
        console.log(tokenIds);

        const inputTensor = new Tensor("int64", BigInt64Array.from(tokenIds.map(BigInt)), [1, tokenIds.length]);
        console.log(this.session.inputNames);
        const feeds: Record<string, Tensor> = { text: inputTensor };
        const results = await this.session.run(feeds);

        const outputTensor = results["output"];
        if (!outputTensor) {
            throw new Error("No output tensor from model");
        }

        // outputTensor.data is usually a TypedArray (Int64Array or BigInt64Array)
        const outIds: number[] = Array.from(outputTensor.data as any).map((x) => Number(x));

        return decode(outIds);
    }
}