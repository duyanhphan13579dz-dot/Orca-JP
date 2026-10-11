/// <reference lib="webworker" />

export interface WorkerMessagePayload {
  type: 'LOAD_CHUNKS';
  baseUrl?: string;
  chunks: string[];
}

export interface WorkerProgressPayload {
  type: 'PROGRESS';
  chunk: string;
  loaded: number;
  total: number;
  percent: number;
}

export interface WorkerCompletePayload {
  type: 'COMPLETE';
  totalChunks: number;
  data: Record<string, unknown[]>;
}

export interface WorkerErrorPayload {
  type: 'ERROR';
  error: string;
}

self.onmessage = async (e: MessageEvent<WorkerMessagePayload>) => {
  if (e.data.type === 'LOAD_CHUNKS') {
    const { baseUrl = '', chunks } = e.data;
    const total = chunks.length;
    const collectedData: Record<string, unknown[]> = {};

    try {
      for (let i = 0; i < total; i++) {
        const chunkName = chunks[i];
        const url = `${baseUrl}/data/${chunkName}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch chunk ${chunkName}: HTTP ${res.status}`);
        }

        const json = await res.json();
        collectedData[chunkName] = Array.isArray(json) ? json : [json];

        const percent = Math.round(((i + 1) / total) * 100);
        const progressMsg: WorkerProgressPayload = {
          type: 'PROGRESS',
          chunk: chunkName,
          loaded: i + 1,
          total,
          percent,
        };
        self.postMessage(progressMsg);
      }

      const completeMsg: WorkerCompletePayload = {
        type: 'COMPLETE',
        totalChunks: total,
        data: collectedData,
      };
      self.postMessage(completeMsg);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const errorMsg: WorkerErrorPayload = {
        type: 'ERROR',
        error: errMsg,
      };
      self.postMessage(errorMsg);
    }
  }
};
