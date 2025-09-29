// /content/projects.ts
import type { Project } from "./schema.js";

export const projects: Project[] = [
  {
    title: "Fast Vision Inference",
    description: "Optimized transformer pipeline with ONNX + CUDA.",
    tech: ["TypeScript", "PyTorch", "ONNX"],
    href: "https://example.com/demo",
    repo: "https://github.com/anselmlong/anselmbot",
    highlight: true,
  },
  // ...
];
