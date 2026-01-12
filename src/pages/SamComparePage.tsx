import { ModelViewer } from "@/components/ModelViewer";
import "@google/model-viewer";

export const SamComparePage = () => {
  return (
    <div className="h-screen w-screen grid grid-cols-2">
      <div className="h-full w-full border-r border-zinc-700">
        <div className="p-2 bg-zinc-900 text-zinc-100 text-sm font-medium">
          Hunyuan
        </div>
        <div className="h-[calc(100%-36px)]">
          <ModelViewer
            src="https://openreal2sim.s3.us-west-2.amazonaws.com/sam_compare/hunyuan.glb"
            alt="Hunyuan model"
          />
        </div>
      </div>
      <div className="h-full w-full">
        <div className="p-2 bg-zinc-900 text-zinc-100 text-sm font-medium">
          SAM
        </div>
        <div className="h-[calc(100%-36px)]">
          <ModelViewer
            src="https://openreal2sim.s3.us-west-2.amazonaws.com/sam_compare/sam.glb"
            alt="SAM model"
          />
        </div>
      </div>
    </div>
  );
};
