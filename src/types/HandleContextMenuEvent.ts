export interface HandleContextMenuEvent {
    preventDefault: () => void;
    clientX: number;
    clientY: number;
    target: any,
    type: string,
  }