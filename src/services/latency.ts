/** Small artificial latency so mock services exercise real loading states. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const NETWORK_SIMULATION_MS = 180;
