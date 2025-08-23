// Reexport the native module. On web, it will be resolved to KokoroModule.web.ts
// and on native platforms to KokoroModule.ts
export { default } from './KokoroModule';
export { default as KokoroView } from './KokoroView';
export * from  './Kokoro.types';
