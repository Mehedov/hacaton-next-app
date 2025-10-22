declare module '@xyflow/react/dist/style.css' {
  const content: string;
  export default content;
}

import { Node as XYFlowNode, Edge as XYFlowEdge } from '@xyflow/react';

export interface NodeData {
  label: string;
  details?: string;
}

export interface Node extends XYFlowNode {
  data: NodeData;
}

export type Edge = XYFlowEdge