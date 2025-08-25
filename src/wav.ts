function floatArrayToWAV(floatArray: Float32Array, sampleRate: number): string {
    // Convert float array to Int16Array (16-bit PCM)
    const numSamples = floatArray.length;
    const int16Array = new Int16Array(numSamples);
    
    for (let i = 0; i < numSamples; i++) {
      // Convert float in range [-1, 1] to int16 in range [-32768, 32767]
      int16Array[i] = Math.max(-32768, Math.min(32767, Math.floor(floatArray[i] * 32767)));
    }
    
    // Create WAV header
    const headerLength = 44;
    const dataLength = int16Array.length * 2; // 2 bytes per sample
    const buffer = new ArrayBuffer(headerLength + dataLength);
    const view = new DataView(buffer);
    
    // Write WAV header
    // "RIFF" chunk descriptor
    view.setUint8(0, 'R'.charCodeAt(0));
    view.setUint8(1, 'I'.charCodeAt(0));
    view.setUint8(2, 'F'.charCodeAt(0));
    view.setUint8(3, 'F'.charCodeAt(0));
    
    // Chunk size
    view.setUint32(4, 36 + dataLength, true);
    
    // "WAVE" format
    view.setUint8(8, 'W'.charCodeAt(0));
    view.setUint8(9, 'A'.charCodeAt(0));
    view.setUint8(10, 'V'.charCodeAt(0));
    view.setUint8(11, 'E'.charCodeAt(0));
    
    // "fmt " subchunk
    view.setUint8(12, 'f'.charCodeAt(0));
    view.setUint8(13, 'm'.charCodeAt(0));
    view.setUint8(14, 't'.charCodeAt(0));
    view.setUint8(15, ' '.charCodeAt(0));
    
    // Subchunk size
    view.setUint32(16, 16, true);
    
    // Audio format (PCM)
    view.setUint16(20, 1, true);
    
    // Number of channels
    view.setUint16(22, 1, true);
    
    // Sample rate
    view.setUint32(24, sampleRate, true);
    
    // Byte rate
    view.setUint32(28, sampleRate * 2, true);
    
    // Block align
    view.setUint16(32, 2, true);
    
    // Bits per sample
    view.setUint16(34, 16, true);
    
    // "data" subchunk
    view.setUint8(36, 'd'.charCodeAt(0));
    view.setUint8(37, 'a'.charCodeAt(0));
    view.setUint8(38, 't'.charCodeAt(0));
    view.setUint8(39, 'a'.charCodeAt(0));
    
    // Subchunk size
    view.setUint32(40, dataLength, true);
    
    // Write audio data
    for (let i = 0; i < numSamples; i++) {
      view.setInt16(headerLength + i * 2, int16Array[i], true);
    }
    
    const bytes = new Uint8Array(buffer);

    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}

export default floatArrayToWAV;