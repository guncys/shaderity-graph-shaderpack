export interface CustomNodeModule extends NodeModule {
  cacheable: Function;
}

export interface SGSPcomment {
  lineNumber: number;
  content: string;
}
