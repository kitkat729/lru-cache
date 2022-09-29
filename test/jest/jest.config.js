module.exports = {
  rootDir: "../../",
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  globals: {
    "ts-jest": { tsconfig: "tsconfig.json", isolatedModules: true },
  },
  testPathIgnorePatterns: ["<rootDir>/lib", "<rootDir>/node_modules"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  coverageDirectory: "./coverage/",
  collectCoverage: true,
};
