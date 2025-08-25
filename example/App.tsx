import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Button, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import { Kokoro, Voice } from 'expo-kokoro';

export default function App() {
  const [text, setText] = useState('Hello from Kokoro!');
  const [voice, setVoice] = useState<Voice>(Voice.Bella);
  const [isLoading, setIsLoading] = useState(false);
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const kokoroRef = useRef<Kokoro | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const availableVoices = useMemo(() => Object.values(Voice), []);

  async function ensureModelLoaded(): Promise<Kokoro> {
    if (kokoroRef.current) return kokoroRef.current;

    const asset = Asset.fromModule(require('./assets/kokoro-quantized.onnx'));
    if (!asset.downloaded) {
      await asset.downloadAsync();
    }
    const modelPath = asset.localUri ?? asset.uri;

    const kokoro = await Kokoro.from_checkpoint(modelPath);
    kokoroRef.current = kokoro;
    return kokoro;
  }

  async function onGenerate() {
    setIsLoading(true);
    setError(null);
    setOutputPath(null);
    try {
      const kokoro = await ensureModelLoaded();
      const output = `${FileSystem.cacheDirectory}kokoro-output-${Date.now()}.wav`;
      await kokoro.generate(text, voice, output);
      setOutputPath(output);

      // Prepare and play audio via expo-av
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        { uri: output },
        { shouldPlay: true }
      );
      soundRef.current = sound;
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Kokoro TTS Example</Text>

        <Group name="Text">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Enter text to synthesize"
            style={styles.input}
            editable={!isLoading}
          />
        </Group>

        <Group name="Voice">
          <View style={styles.voiceRow}>
            {availableVoices.slice(0, 4).map((v) => (
              <Button key={v} title={v} onPress={() => setVoice(v)} />
            ))}
          </View>
          <View style={styles.voiceRow}>
            {availableVoices.slice(4, 8).map((v) => (
              <Button key={v} title={v} onPress={() => setVoice(v)} />
            ))}
          </View>
          <View style={styles.voiceRow}>
            {availableVoices.slice(8).map((v) => (
              <Button key={v} title={v} onPress={() => setVoice(v)} />
            ))}
          </View>
          <Text style={{ marginTop: 10 }}>Selected: {voice}</Text>
        </Group>

        <Group name="Action">
          <Button title={isLoading ? 'Generating…' : 'Generate WAV'} onPress={onGenerate} disabled={isLoading} />
        </Group>

        {outputPath && (
          <Group name="Result">
            <Text>Saved to:</Text>
            <Text selectable>{outputPath}</Text>
          </Group>
        )}

        {error && (
          <Group name="Error">
            <Text style={{ color: 'red' }}>{error}</Text>
          </Group>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  voiceRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    gap: 8,
    marginBottom: 8,
  },
};
