
import { createVnode } from "./createVnode";
export function createAppApi (render) {
  const createApp = (rootComponnet) => {
    const app = {
      mount (root) {
        const vnode = createVnode(rootComponnet);
        render(vnode, root)
      }
    }
    return app;
  }
  return createApp;
}