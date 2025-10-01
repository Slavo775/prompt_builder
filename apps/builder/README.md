# Prompt Builder

A Vue 3 application for managing project phases and generating prompts with template replacements.

## Features

- **5 Phase Management**: Discovery, Planning, Implementation, Testing, Deployment
- **Global Inputs**: Project name, feature name, owner, stack, date, etc.
- **Template System**: Customizable templates with `[TOKEN]` replacements
- **Phase-Specific Inputs**: Additional custom inputs per phase
- **Live Preview**: Real-time template rendering with token replacement
- **Export/Import**: Save and load your configurations
- **Local Storage**: Automatic persistence of your work

## Usage

1. Fill in the global inputs in the sidebar
2. Navigate between phases using the numbered buttons
3. Customize templates by enabling "Custom Template" mode
4. Add phase-specific inputs as needed
5. Use the preview to see the rendered output
6. Copy prompts or export your configuration

## Token System

Templates support the following tokens:

- `[PROJECT_NAME]` - Project name
- `[FEATURE_NAME]` - Feature name
- `[FEATURE_SLUG]` - Feature slug
- `[OWNER]` - Owner name
- `[REPO_URL]` - Repository URL (optional)
- `[STACK]` - Technology stack
- `[DATE_ISO]` - Current date
- Custom phase-specific tokens

## Development

Built with:

- Vue 3 (Composition API)
- TypeScript (strict mode)
- SCSS for styling
- Vite for build tooling

## Architecture

- **Components**: Modular Vue components under 200 lines each
- **Composables**: Reusable logic for phases, replacements, and storage
- **Types**: Comprehensive TypeScript definitions
- **Tests**: Vitest + @testing-library/vue for testing

