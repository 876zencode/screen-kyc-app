declare module 'fluid-react' {
    export const val: <T>(initial: T) => { value: T };
    export const useVal: <T>(signal: { value: T }) => T;
    export const effect: (fn: () => void) => () => void;
    export const FluidProvider: React.FC<{ children: React.ReactNode }>;
  }
  