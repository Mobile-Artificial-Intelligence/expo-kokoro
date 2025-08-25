import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Kokoro, Voice } from 'expo-kokoro';

export default function App() {
  const [text, setText] = useState('Hello from Kokoro!');
  const [isLoading, setIsLoading] = useState(false);
  const kokoroRef = useRef<Kokoro | null>(null);

  useEffect(() => {
    // Ensure audio plays even if the iOS device is in silent mode
    // and request proper audio focus on Android
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

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

  async function onSpeak() {
    setIsLoading(true);
    try {
      const kokoro = await ensureModelLoaded();
      const output = `${FileSystem.cacheDirectory}kokoro-${Date.now()}.wav`;
      await kokoro.generate(text, Voice.Af, output);

      const { sound } = await Audio.Sound.createAsync({ uri: output });
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
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
