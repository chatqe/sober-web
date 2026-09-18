/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_WEB_URL: string
  readonly VITE_UPLOAD_URL: string
  readonly VITE_IM_URL: string
  readonly VITE_WEBSOCKET_URL: string
  readonly VITE_DEBUG: string
  readonly VITE_APP_NAME: string
  readonly VITE_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const tocbot: {
  init: (opts: any) => void;
}

declare const hljs: {
  getLanguage: (name: string) => { name: string } | undefined;
  highlightAuto: (text: string) => { language: string };
  highlightBlock: (el: HTMLElement) => void;
  lineNumbersBlock: (el: HTMLElement) => void;
}

declare const ClipboardJS: new (selector: string) => { destroy: () => void };
