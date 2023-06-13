const nextJest = require("next/jest");
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});
const jestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$',
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/coverage",
    "<rootDir>/dist",
  ],
  coveragePathIgnorePatterns:[
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/coverage",
    "<rootDir>/dist",
     "<rootDir>/src/pages",
     "<rootDir>/src/assets",
     "<rootDir>/public",
      "\\.config\\.(ts|js)$"
  ],
  moduleDirectories: [
    "<rootDir>/node_modules",
    "<rootDir>/src",
    "<rootDir>/pages",
  ],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "@pages/(.*)": "<rootDir>/src/pages/$1",
    "@components/(.*)": "<rootDir>/src/components/$1",
    "@styles/(.*)": "<rootDir>/styles/$1",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "<rootDir>/styleMock.js",
    // https://jestjs.io/docs/webpack#handling-static-assets
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$": `<rootDir>/fileMock.js`,
    "d3": "<rootDir>/mocks/d3Mock.ts",
  },
  coverageDirectory: "coverage",
 transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
     "/node_modules/(?!d3)/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

module.exports = createJestConfig(jestConfig);
