declare module '@finsweet/eslint-config/prettier' {
  import type { Linter } from 'eslint';
  const config: readonly Linter.Config[];
  export default config;
}
