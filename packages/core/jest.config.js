module.exports = {
  preset: "@stencil/core/testing",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "@stencil/core/testing",
  },
};
