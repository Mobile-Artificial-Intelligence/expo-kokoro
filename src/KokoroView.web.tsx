import * as React from 'react';

import { KokoroViewProps } from './Kokoro.types';

export default function KokoroView(props: KokoroViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
