import p5Types from 'p5';

// eslint-disable-next-line @typescript-eslint/ban-types
export type P5Component<Props = {}> = (p5: p5Types, props: Props) => void;
