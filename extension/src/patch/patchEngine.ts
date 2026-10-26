export interface PatchChange {
  filePath: string;
  originalContent: string;
  proposedContent: string;
  diffHunk: string;
}

export class PatchEngine {
  public static generateDiffHunk(original: string, proposed: string, filePath: string): string {
    const origLines = original.split('\n');
    const propLines = proposed.split('\n');
    let hunk = `--- a/${filePath}\n+++ b/${filePath}\n@@ -1,${origLines.length} +1,${propLines.length} @@\n`;

    for (let i = 0; i < Math.max(origLines.length, propLines.length); i++) {
      const o = origLines[i];
      const p = propLines[i];
      if (o !== undefined && p !== undefined && o === p) {
        hunk += ` ${o}\n`;
      } else {
        if (o !== undefined) hunk += `-${o}\n`;
        if (p !== undefined) hunk += `+${p}\n`;
      }
    }
    return hunk;
  }

  public static createProposedPatch(filePath: string, originalContent: string, proposedContent: string): PatchChange {
    return {
      filePath,
      originalContent,
      proposedContent,
      diffHunk: this.generateDiffHunk(originalContent, proposedContent, filePath)
    };
  }
}
