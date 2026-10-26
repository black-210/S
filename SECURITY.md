# RIPOSTE — Security & Trust Policy

- API keys are protected using Code OSS SecretStorage or environment variables.
- Prompt inputs are filtered to prevent secret leakage.
- Commands are executed via safe process argument arrays to prevent shell injection.
