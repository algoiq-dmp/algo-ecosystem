# 25 — Glossary

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## A

**API Contract Testing**: Validation that API responses match the OpenAPI/Swagger specification exactly.

**Assertion**: A single check within a test case. A test case may contain multiple assertions.

## B

**Baseline**: The previous submission used for comparison in regression analysis.

**Boundary Testing**: Testing edge cases at the limits of valid input ranges (zero, maximum, empty, null).

**Build Gate**: A CI/CD checkpoint that blocks progression if tests fail.

## C

**Certification**: The formal seal of approval indicating a component has passed all mandatory Parikshak tests.

**Certificate**: A cryptographically signed document attesting to certification status.

**Chaos Testing**: Deliberately introducing failures (network drops, process kills) to validate system resilience.

**Checklist**: A binary Go/No-Go verification document for mandatory deployment checks.

**CI/CD**: Continuous Integration / Continuous Delivery. The automated pipeline for building, testing, and deploying software.

**Conditional GO**: A readiness verdict indicating all critical gates passed but non-critical warnings exist.

**Coverage**: The percentage of code exercised by tests (line coverage, branch coverage).

## D

**DAST (Dynamic Application Security Testing)**: Security scanning of a running application.

**DLQ (Dead Letter Queue)**: MQ queue for messages that could not be processed successfully.

**DXCC**: Deployment & eXchange Compliance Controller — the approval gate before production.

## F

**Flaky Test**: A test that produces inconsistent results (sometimes passes, sometimes fails) without code changes.

**Fixture**: Pre-configured test environment state (data, mocks, configuration).

## G

**Gate**: A mandatory checkpoint in the testing pipeline that must be passed to proceed.

**GO**: A readiness verdict indicating all tests passed and the component is ready for the next stage.

**Golden Dataset**: A curated set of test inputs and expected outputs used for regression testing.

## H

**Hook**: Lifecycle callback functions executed before/after test suites or individual tests.

**HPA (Horizontal Pod Autoscaler)**: Kubernetes mechanism that scales worker replicas based on load.

## I

**Integration Testing**: Validating that multiple components work together correctly.

## K

**k6**: An open-source load testing tool used by Parikshak for performance benchmarking.

## M

**Mock**: A simulated service or component used in place of a real dependency during testing.

**MQ (Message Queue)**: RabbitMQ-based messaging backbone for inter-engine communication.

## N

**NO-GO**: A readiness verdict indicating one or more critical gates failed.

## O

**Orchestrator**: The central Parikshak component that manages test scheduling and dispatch.

## P

**Parikshak**: The enterprise testing engine. Named after the Hindi word for "examination" or "test."

**Performance Budget**: Maximum allowed resource consumption (latency, memory) for a component.

## R

**Readiness Report**: The definitive Go/No-Go recommendation consolidating all test outcomes.

**Regression**: A previously passing test that now fails, or a performance metric that has degraded.

**Runner**: A test execution engine (Jest, Mocha, k6, custom harness).

## S

**SAST (Static Application Security Testing)**: Code-level security analysis without execution.

**SBOM (Software Bill of Materials)**: A list of all third-party components and their versions.

**SLA (Service Level Agreement)**: The maximum acceptable value for a metric (e.g., P99 latency < 1000ms).

**Smoke Test**: A minimal set of tests verifying critical path functionality. Fast, runs on every commit.

**Soak Test**: A long-duration test designed to detect memory leaks and resource degradation.

**Submission**: A request to Parikshak to execute one or more test suites against a component.

**Suite**: A collection of related test cases organized by purpose (e.g., strategy-full, engine-regression).

## T

**Test Case**: A single, atomic test with inputs, execution steps, and expected outcomes.

**Threshold**: The pass/fail boundary for a metric or gate.

**Trend Analysis**: Comparing test results over time to detect gradual degradation.

## U

**UAT (User Acceptance Testing)**: End-to-end workflow testing from the user's perspective.

**Unit Testing**: Validating individual functions, classes, or modules in isolation.

## W

**Walk-Forward Optimization**: A backtesting technique that validates parameter stability across rolling time windows.

**Worker**: A containerized process that executes test suites assigned by the Orchestrator.
