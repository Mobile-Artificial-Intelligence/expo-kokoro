import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, TextInput, Alert } from 'react-native';
import { AudioSource, useAudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import { Vits } from 'expo-kokoro';

export default function App() {
  const [source, setSource] = useState<AudioSource | null>(null);
  const player = useAudioPlayer(source);
  const [text, setText] = useState('Hello from Kokoro!');
  const [isLoading, setIsLoading] = useState(false);
  const vitsRef = useRef<Vits | null>(null);

  useEffect(() => {
    try {
      if (player && !player.playing && source) {
        player.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }, [player, source])

  async function ensureModelLoaded(): Promise<Vits> {
    try {
      if (vitsRef.current) return vitsRef.current;

      const model = await Vits.load();
      vitsRef.current = model;
      return model;
    } catch (err) {
      console.error("Failed to load model:", err);
      Alert.alert("Error", "Failed to load Vits model: " + (err as Error).message);
      throw err;
    }
  }

  async function onSpeak() {
    setIsLoading(true);
    try {
      const kokoro = await ensureModelLoaded();
      const output = `${FileSystem.cacheDirectory}kokoro-${Date.now()}.wav`;
      console.log("Generating speech to:", output);

      await kokoro.generate(text, output);
      console.log("Generated audio, now playing...");

      const source: AudioSource = { uri: output };
      setSource(source);
    } catch (err) {
      console.error("Speak error:", err);
      Alert.alert("Error", "Something went wrong:\n" + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Enter text"
        style={{ backgroundColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 20 }}
        editable={!isLoading}
      />
      <Button title={isLoading ? 'Speaking…' : 'Speak'} onPress={onSpeak} disabled={isLoading} />
    </SafeAreaView>
  );
}
