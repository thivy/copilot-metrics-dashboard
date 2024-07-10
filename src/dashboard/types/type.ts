const azureEnvVars = [
  "GITHUB_ENTERPRISE",
  "GITHUB_TOKEN",
  "GITHUB_ORGANIZATION",
] as const;

type RequiredServerEnvKeys = (typeof azureEnvVars)[number];

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<RequiredServerEnvKeys, string> {}
  }
}

export {};
