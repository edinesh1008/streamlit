# Protocol Buffers with Buf

This directory contains Streamlit's Protocol Buffer definitions and uses [Buf](https://buf.build) for linting and formatting.

## Setup

### Install Buf

From the project root:
```bash
make buf-install
```

Or manually:
```bash
brew install bufbuild/buf/buf  # On macOS
# Or download from https://github.com/bufbuild/buf/releases
```

## Usage

### From Project Root (Recommended)

```bash
# Lint proto files
make buf-lint

# Format proto files
make buf-format

# Check for breaking changes
make buf-breaking

# Generate code from protos (still uses existing protoc)
make protobuf
```

### From Proto Directory

```bash
cd proto/

# Lint all proto files
buf lint

# Format proto files in place
buf format -w

# Check for breaking changes against main branch
buf breaking --against '.git#branch=develop'

# Build/compile check proto files
buf build
```

## Configuration

- `buf.yaml` - Main configuration for linting, formatting, and breaking change detection
- `buf.gen.yaml` - Code generation configuration (optional, for future use)
- `.bufignore` - Patterns for files to ignore

## Linting Rules

Currently configured with:
- `MINIMAL` lint rules as a starting point
- Exceptions for existing patterns in the codebase
- Can be gradually made stricter by changing from `MINIMAL` to `STANDARD` in `buf.yaml`

## Breaking Change Detection

The `buf-breaking` command checks for breaking changes against the `develop` branch. This helps ensure backward compatibility when modifying proto files.

## Integration with CI/CD

To add buf to your CI pipeline:

```yaml
# Example GitHub Actions workflow
- name: Install buf
  run: make buf-install

- name: Lint protos
  run: make buf-lint

- name: Check breaking changes
  run: make buf-breaking
```

## Gradual Migration

The current configuration is lenient to work with existing proto files. To gradually improve:

1. Fix existing lint issues one category at a time
2. Remove exceptions from `buf.yaml` as issues are fixed
3. Eventually upgrade from `MINIMAL` to `STANDARD` lint rules

## Notes

- The `openmetrics_data_model.proto` file is ignored in linting as it follows different conventions
- Java package options are preserved for backward compatibility
- The existing `make protobuf` command continues to work for code generation
