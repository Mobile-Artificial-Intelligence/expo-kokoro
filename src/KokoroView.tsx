import { requireNativeView } from 'expo';
import * as React from 'react';

import { KokoroViewProps } from './Kokoro.types';

const NativeView: React.ComponentType<KokoroViewProps> =
  requireNativeView('Kokoro');

export default function KokoroView(props: KokoroViewProps) {
  return <NativeView {...props} />;
}
