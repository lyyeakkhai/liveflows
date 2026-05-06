# Documentation & Architecture Standards

These rules apply to all files within the `docs/` directory.

## File Organization
- **PRD**: The main Product Requirements Document is `docs/prd.md`.
- **Architectures**: System designs and blueprints live in `docs/architectures/`.
- **Features**: Detailed feature specifications live in `docs/features/`.

## Content Standards
- **Format**: Use GitHub-flavored Markdown.
- **Diagrams**: Use Mermaid.js syntax for all flowcharts, sequence diagrams, and entity-relationship diagrams.
- **Metadata**: Every file must start with a level 1 heading and a brief "Last Updated" date.
- **Links**: Use relative paths for internal references (e.g., `[System Design](./architectures/system-design.md)`).

## Agent Constraints
- Only the `doc-arch-specialist` or agents with explicit documentation mandates should perform structural refactoring of this folder.
- Ensure any changes in `docs/prd.md` are reflected in the corresponding feature docs.
