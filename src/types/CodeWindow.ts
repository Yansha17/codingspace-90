
export interface CodeWindowType {
  id: string;
  title: string;
  language: string;
  code: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  zIndex: number;
}
