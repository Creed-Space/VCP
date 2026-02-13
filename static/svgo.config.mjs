export default {
  multipass: true,
  floatPrecision: 0,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          mergePaths: { force: true },
          convertPathData: { floatPrecision: 0, transformPrecision: 0 },
          cleanupNumericValues: { floatPrecision: 0 },
          collapseGroups: true,
          removeUselessStrokeAndFill: true,
          removeEmptyAttrs: true,
        },
      },
    },
  ],
};
