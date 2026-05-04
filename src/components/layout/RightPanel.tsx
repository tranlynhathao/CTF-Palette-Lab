import { ColorInspector } from "../inspector/ColorInspector";
import { SmartSuggestions } from "../inspector/SmartSuggestions";
import { ExportPanel } from "../export/ExportPanel";
import { IllustratorExportPanel } from "../export/IllustratorExportPanel";
import { DesignSystemStarter } from "../inspector/DesignSystemStarter";

export function RightPanel() {
  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto p-4 lg:p-5">
      <ColorInspector />
      <SmartSuggestions />
      <DesignSystemStarter />
      <IllustratorExportPanel />
      <ExportPanel />
    </aside>
  );
}
