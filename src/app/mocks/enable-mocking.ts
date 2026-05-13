export async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import("./browser.ts")

  await worker.start()
}
