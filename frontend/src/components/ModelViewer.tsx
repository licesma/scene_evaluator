// @ts-nocheck

export function ModelViewer({ src, alt }: { src: string; alt: string }) {
  return (
    <model-viewer
      src={src}
      alt={alt}
      camera-controls
      rotation="0 0 0"
      rotation-per-second="9deg"
      interaction-prompt="none"
      camera-target="50% 50% 50%"
      camera-orbit="150deg 90deg 2m"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#dae7f7ff",
      }}
    ></model-viewer>
  );
}
