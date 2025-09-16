#!/usr/bin/env python3
# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Stop hook for Claude Code in Streamlit repository.
Runs quality checks before allowing Claude to complete tasks.
"""

from __future__ import annotations

import json
import subprocess
import sys


def run_command(cmd: list[str], cwd: str | None = None) -> tuple[int, str, str]:
    """Run a command and return exit code, stdout, and stderr."""
    try:
        result = subprocess.run(  # noqa: S603
            cmd,
            check=False,
            capture_output=True,
            text=True,
            cwd=cwd,
            timeout=60,  # 60 second timeout per command (frontend takes longer)
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 1, "", f"Command timed out: {' '.join(cmd)}"
    except Exception as e:
        return 1, "", str(e)


def check_python_quality() -> list[str]:
    """Run Python linting."""
    issues = []

    # Run Python linting using make command
    exit_code, stdout, stderr = run_command(["make", "python-lint"])
    if exit_code != 0:
        # Combine stdout and stderr for better error reporting
        output = (stdout + "\n" + stderr).strip()
        # Keep only the most relevant lines
        lines = output.split("\n")
        relevant_lines = [
            line
            for line in lines
            if any(
                keyword in line.lower()
                for keyword in ["error", "would reformat", "failed", "***"]
            )
        ]
        if relevant_lines:
            issues.append("Python linting failed:\n" + "\n".join(relevant_lines))
        else:
            issues.append("Python linting failed (run 'make python-lint' for details)")

    # Run Python type checking using make command
    exit_code, stdout, stderr = run_command(["make", "python-types"])
    if exit_code != 0:
        # Combine stdout and stderr for better error reporting
        output = (stdout + "\n" + stderr).strip()
        # Keep only the most relevant lines
        lines = output.split("\n")
        relevant_lines = [
            line
            for line in lines
            if any(
                keyword in line.lower()
                for keyword in ["error", "failed", "***", ".py:"]
            )
        ]
        if relevant_lines:
            issues.append("Python type checking failed:\n" + "\n".join(relevant_lines))
        else:
            issues.append(
                "Python type checking failed (run 'make python-types' for details)"
            )

    return issues


def check_frontend_quality() -> list[str]:
    """Run frontend linting and type checking."""
    issues = []

    # Run frontend linting
    exit_code, stdout, stderr = run_command(["make", "frontend-lint"])
    if exit_code != 0:
        # Combine stdout and stderr for better error reporting
        output = (stdout + "\n" + stderr).strip()

        # Check if this is a missing node_modules issue
        if "node_modules" in output.lower() or "findpackagelocation" in output.lower():
            # Skip frontend checks if dependencies aren't installed
            print(  # noqa: T201
                "⚠️  Skipping frontend checks - node_modules not installed",
                file=sys.stderr,
            )
            return []

        # Keep only the most relevant lines
        lines = output.split("\n")
        relevant_lines = [
            line
            for line in lines
            if any(
                keyword in line.lower()
                for keyword in [
                    "error",
                    "failed",
                    "***",
                    ".ts:",
                    ".tsx:",
                    ".js:",
                    ".jsx:",
                ]
            )
        ]
        if relevant_lines:
            issues.append("Frontend linting failed:\n" + "\n".join(relevant_lines))
        else:
            issues.append(
                "Frontend linting failed (run 'make frontend-lint' for details)"
            )

    # Run frontend type checking
    exit_code, stdout, stderr = run_command(["make", "frontend-types"])
    if exit_code != 0:
        # Combine stdout and stderr for better error reporting
        output = (stdout + "\n" + stderr).strip()
        # Keep only the most relevant lines
        lines = output.split("\n")
        relevant_lines = [
            line
            for line in lines
            if any(
                keyword in line.lower()
                for keyword in [
                    "error",
                    "failed",
                    "***",
                    ".ts:",
                    ".tsx:",
                    ".js:",
                    ".jsx:",
                ]
            )
        ]
        if relevant_lines:
            issues.append(
                "Frontend type checking failed:\n" + "\n".join(relevant_lines)
            )
        else:
            issues.append(
                "Frontend type checking failed (run 'make frontend-types' for details)"
            )

    return issues


def main():
    """Main entry point for the stop hook."""
    # Check if stop_hook_active is set to prevent infinite loops
    stdin_input = sys.stdin.read() if not sys.stdin.isatty() else "{}"

    try:
        hook_input = json.loads(stdin_input)
    except json.JSONDecodeError:
        hook_input = {}

    if hook_input.get("stop_hook_active"):
        # Already in a stop hook, allow normal stoppage
        sys.exit(0)

    all_issues = []

    # Run quality checks
    python_issues = check_python_quality()
    all_issues.extend(python_issues)

    frontend_issues = check_frontend_quality()
    all_issues.extend(frontend_issues)

    # Decide whether to block
    if all_issues:
        # Output to stderr for user feedback
        print(  # noqa: T201
            "❌ Quality checks failed! Please fix the following issues:",
            file=sys.stderr,
        )
        print("=" * 60, file=sys.stderr)  # noqa: T201
        for issue in all_issues:
            print(f"\n{issue}", file=sys.stderr)  # noqa: T201
        print("=" * 60, file=sys.stderr)  # noqa: T201
        print(  # noqa: T201
            "\n💡 Run 'make autofix' to automatically fix formatting issues",
            file=sys.stderr,
        )

        sys.exit(2)  # Exit code 2 blocks stoppage
    else:
        # Everything passed
        print("✅ All quality checks passed!", file=sys.stderr)  # noqa: T201
        sys.exit(0)


if __name__ == "__main__":
    main()
