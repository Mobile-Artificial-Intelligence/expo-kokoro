import { registerWebModule, NativeModule } from 'expo';

import { KokoroModuleEvents } from './Kokoro.types';

class KokoroModule extends NativeModule<KokoroModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(KokoroModule, 'KokoroModule');
