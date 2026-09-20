// src/components/workspace/tools/design/designEngine.ts
// Engine dedicated to Design Editor / Filerobot / Canvas Studio

export class DesignEngine {
  /**
   * Helper to format design config and canvas operations
   */
  public static getEditorConfig() {
    return {
      theme: 'dark',
      annotationsCommon: {
        fill: '#ff0000',
      },
    };
  }
}
