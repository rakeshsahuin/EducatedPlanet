# Kilo Code Workflow Guide for EducatedPlanet

## Table of Contents
1. [Introduction](#introduction)
2. [Understanding Kilo Code Modes](#understanding-kilo-code-modes)
3. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
4. [Workflow Patterns for Development Scenarios](#workflow-patterns-for-development-scenarios)
5. [Common Tasks and Mode Sequences](#common-tasks-and-mode-sequences)
6. [Best Practices for Monorepo Structure](#best-practices-for-monorepo-structure)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Advanced Techniques](#advanced-techniques)

---

## Introduction

This guide provides comprehensive instructions for implementing and using the Claude subagent functionalities in the Kilo Code workflow for the EducatedPlanet project. It's designed to help you achieve the same specialized functionality you had with Claude subagents using Kilo Code's mode system.

### Project Overview

EducatedPlanet is a monorepo-based local tutor listing platform with the following structure:
- **web/**: Next.js 16+ web application (student/tutor-facing)
- **admin/**: Admin panel application (currently empty, to be implemented)
- **models/**: Shared TypeScript interfaces and types
- **dataservice/**: MongoDB data layer and business logic
- **common/**: Shared utilities and constants

### What You'll Learn

- How to implement and configure Kilo Code modes
- Workflow patterns for different development scenarios
- Best practices for working with the EducatedPlanet monorepo
- How to transition from Claude subagents to Kilo Code modes

---

## Understanding Kilo Code Modes

Kilo Code provides a mode-based system that replaces Claude's subagent functionality. Each mode is specialized for specific tasks and can be invoked based on your development needs.

### Available Modes in EducatedPlanet

Based on the [`.kilocodemodes`](.kilocodemodes) configuration, the following modes are available:

1. **Code Reviewer** (`code-reviewer`)
   - Conducts thorough code reviews
   - Focuses on code quality, security, performance, and maintainability
   - Provides constructive feedback on code patterns and potential bugs

2. **Code Simplifier** (`code-simplifier`)
   - Expert refactoring specialist
   - Makes code clearer, more concise, and easier to maintain
   - Preserves behavior while improving code quality

3. **Documentation Specialist** (`docs-specialist`)
   - Technical writing expert
   - Creates clear, comprehensive documentation
   - Focuses on proper formatting and examples

4. **Frontend Specialist** (`frontend-specialist`)
   - React, TypeScript, and modern CSS expert
   - Creates intuitive user interfaces
   - Prioritizes accessibility, responsive design, and performance

### Mode Capabilities

Each mode has specific capabilities defined by:
- **Groups**: Determine which tools and actions the mode can access
- **Role Definition**: Defines the mode's purpose and expertise
- **Custom Instructions**: Provides specific guidance for the mode

---

## Step-by-Step Implementation Guide

### Step 1: Verify Current Mode Configuration

First, check your current Kilo Code mode configuration:

```bash
# Check if .kilocodemodes file exists
ls -la .kilocodemodes

# View current mode configuration
cat .kilocodemodes
```

The configuration should include the four modes mentioned above. If not, you can add them using the format shown in the existing file.

### Step 2: Understanding Mode Switching

Kilo Code allows you to switch between modes based on your current task:

```bash
# Switch to a specific mode
/mode code-reviewer
/mode code-simplifier
/mode docs-specialist
/mode frontend-specialist

# Return to default mode
/mode default
```

### Step 3: Implementing Mode-Specific Workflows

#### For Code Reviews

1. **Switch to Code Reviewer mode**:
   ```bash
   /mode code-reviewer
   ```

2. **Request a review**:
   ```
   "Please review the tutor service implementation in dataservice/src/services/tutor.service.ts"
   ```

3. **The Code Reviewer will**:
   - Analyze code quality and patterns
   - Identify potential bugs and security issues
   - Suggest improvements for maintainability
   - Provide specific, actionable feedback

#### For Code Refactoring

1. **Switch to Code Simplifier mode**:
   ```bash
   /mode code-simplifier
   ```

2. **Request refactoring**:
   ```
   "Please simplify the tutor card component in web/components/featured-tutors/tutor-card.tsx"
   ```

3. **The Code Simplifier will**:
   - Analyze the code structure
   - Reduce complexity while preserving behavior
   - Eliminate redundancy
   - Improve naming and organization
   - Provide before/after comparisons

#### For Documentation Tasks

1. **Switch to Documentation Specialist mode**:
   ```bash
   /mode docs-specialist
   ```

2. **Request documentation**:
   ```
   "Create comprehensive API documentation for the tutor service"
   ```

3. **The Documentation Specialist will**:
   - Create clear, structured documentation
   - Include practical examples
   - Ensure consistency in tone and style
   - Check for broken links and formatting issues

#### For Frontend Development

1. **Switch to Frontend Specialist mode**:
   ```bash
   /mode frontend-specialist
   ```

2. **Request frontend work**:
   ```
   "Create a responsive tutor search interface with filters"
   ```

3. **The Frontend Specialist will**:
   - Focus on React best practices
   - Ensure accessibility and responsive design
   - Optimize for performance
   - Use semantic HTML

### Step 4: Creating Custom Mode Workflows

You can create custom workflows by combining modes:

```bash
# Example: Implementing a new feature
1. /mode docs-specialist
   "Document the requirements for the new tutor booking system"

2. /mode frontend-specialist
   "Create the booking interface components"

3. /mode code-simplifier
   "Refactor the booking components for better maintainability"

4. /mode code-reviewer
   "Review the complete booking system implementation"
```

---

## Workflow Patterns for Different Development Scenarios

### Scenario 1: Implementing a New Feature

**Use Case**: Adding a tutor booking system

**Mode Sequence**:
1. **Documentation Specialist** - Define requirements and create API documentation
2. **Frontend Specialist** - Implement UI components
3. **Code Simplifier** - Refactor and optimize the implementation
4. **Code Reviewer** - Review the complete implementation

**Example Commands**:
```bash
/mode docs-specialist
"Create API documentation for tutor booking system with endpoints for creating, updating, and canceling bookings"

/mode frontend-specialist
"Implement a booking form component with date selection and tutor availability"

/mode code-simplifier
"Refactor the booking form to use custom hooks and reduce complexity"

/mode code-reviewer
"Review the booking system implementation for security and performance issues"
```

### Scenario 2: Debugging an Issue

**Use Case**: Fixing a performance issue in tutor search

**Mode Sequence**:
1. **Code Reviewer** - Analyze the code for potential issues
2. **Code Simplifier** - Refactor problematic areas
3. **Frontend Specialist** - Optimize UI performance

**Example Commands**:
```bash
/mode code-reviewer
"Analyze the tutor search implementation in web/components/tutor-search.tsx for performance bottlenecks"

/mode code-simplifier
"Optimize the search component by implementing memoization and reducing re-renders"

/mode frontend-specialist
"Implement virtual scrolling for the tutor list to improve performance with large datasets"
```

### Scenario 3: Code Maintenance

**Use Case**: Updating dependencies and refactoring legacy code

**Mode Sequence**:
1. **Code Reviewer** - Identify areas needing updates
2. **Code Simplifier** - Refactor legacy code
3. **Documentation Specialist** - Update documentation

**Example Commands**:
```bash
/mode code-reviewer
"Review the dataservice package for outdated patterns and potential security issues"

/mode code-simplifier
"Modernize the tutor service by using async/await and implementing proper error handling"

/mode docs-specialist
"Update the API documentation to reflect the modernized service methods"
```

### Scenario 4: Cross-Package Development

**Use Case**: Adding a new field to the Tutor model

**Mode Sequence**:
1. **Documentation Specialist** - Document the change
2. **Code Simplifier** - Update the model
3. **Frontend Specialist** - Update UI components
4. **Code Reviewer** - Review all changes

**Example Commands**:
```bash
/mode docs-specialist
"Document the new 'languages' field for the Tutor interface"

/mode code-simplifier
"Add the languages field to the Tutor interface and update related types"

/mode frontend-specialist
"Update the tutor card to display the languages information"

/mode code-reviewer
"Review all changes related to the languages field addition"
```

---

## Common Tasks and Mode Sequences

### Task 1: Creating a New Component

**Recommended Mode Sequence**:
1. **Frontend Specialist** - Create the component
2. **Code Simplifier** - Refactor for maintainability
3. **Code Reviewer** - Review for quality

**Example**:
```bash
/mode frontend-specialist
"Create a reusable TutorProfileCard component with rating, subjects, and contact information"

/mode code-simplifier
"Refactor the TutorProfileCard to extract smaller components and improve readability"

/mode code-reviewer
"Review the TutorProfileCard for accessibility and performance"
```

### Task 2: Implementing API Endpoints

**Recommended Mode Sequence**:
1. **Documentation Specialist** - Define API contract
2. **Code Simplifier** - Implement the service
3. **Code Reviewer** - Review for security

**Example**:
```bash
/mode docs-specialist
"Create API documentation for tutor review endpoints including POST, GET, and PUT operations"

/mode code-simplifier
"Implement the review service with proper validation and error handling"

/mode code-reviewer
"Review the review endpoints for security vulnerabilities and data validation"
```

### Task 3: Optimizing Performance

**Recommended Mode Sequence**:
1. **Code Reviewer** - Identify bottlenecks
2. **Code Simplifier** - Refactor for efficiency
3. **Frontend Specialist** - Optimize UI rendering

**Example**:
```bash
/mode code-reviewer
"Analyze the tutor listing page for performance issues and optimization opportunities"

/mode code-simplifier
"Optimize the data fetching logic by implementing caching and reducing API calls"

/mode frontend-specialist
"Implement lazy loading and code splitting for the tutor listing components"
```

### Task 4: Writing Tests

**Recommended Mode Sequence**:
1. **Documentation Specialist** - Document test requirements
2. **Code Simplifier** - Write testable code
3. **Code Reviewer** - Review test coverage

**Example**:
```bash
/mode docs-specialist
"Document test requirements for the tutor service including unit and integration tests"

/mode code-simplifier
"Refactor the tutor service to make it more testable by extracting dependencies"

/mode code-reviewer
"Review the test suite for coverage and edge cases"
```

---

## Best Practices for Monorepo Structure

### Understanding the EducatedPlanet Monorepo

The EducatedPlanet project follows a clear separation of concerns:

```
educatedplanet/
├── web/                    # Next.js web application
├── admin/                  # Admin panel (to be implemented)
├── models/                 # Shared TypeScript types
├── dataservice/            # MongoDB data layer
└── common/                 # Shared utilities
```

### Package Dependencies

```
web/
├── @educatedplanet/models
├── @educatedplanet/dataservice
└── @educatedplanet/common

admin/
├── @educatedplanet/models
├── @educatedplanet/dataservice
└── @educatedplanet/common

dataservice/
├── @educatedplanet/models
└── @educatedplanet/common

models/
└── @educatedplanet/common
```

### Best Practices

#### 1. Development Order

When making changes across packages, follow this order:

1. **models/** - Update types first
2. **common/** - Update utilities if needed
3. **dataservice/** - Update data layer
4. **web/** and **admin/** - Update applications

#### 2. Mode Usage by Package

- **models/**: Use **Code Simplifier** for clean interfaces, **Code Reviewer** for type safety
- **common/**: Use **Code Simplifier** for pure functions, **Documentation Specialist** for utility docs
- **dataservice/**: Use **Code Reviewer** for security, **Code Simplifier** for service logic
- **web/**: Use **Frontend Specialist** for components, **Code Simplifier** for refactoring
- **admin/**: Use **Frontend Specialist** for admin UI, **Code Reviewer** for authorization

#### 3. Cross-Package Communication

When working across packages:

```bash
# Example: Adding a new feature
/mode docs-specialist
"Document the new tutor analytics feature across all affected packages"

/mode code-simplifier
"Add analytics types to models package and update interfaces"

/mode code-simplifier
"Implement analytics service in dataservice package"

/mode frontend-specialist
"Create analytics dashboard components in admin package"

/mode code-reviewer
"Review all analytics-related changes for consistency and security"
```

#### 4. Testing Strategy

```bash
# Test each package in dependency order
pnpm --filter models test
pnpm --filter common test
pnpm --filter dataservice test
pnpm --filter web test
pnpm --filter admin test
```

#### 5. Build Process

```bash
# Build all packages in correct order
pnpm build

# Build specific package
pnpm --filter models build
```

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: Mode Not Available

**Problem**: `/mode <mode-name>` returns "Mode not found"

**Solution**:
1. Check if the mode is configured in `.kilocodemodes`
2. Verify the mode name is spelled correctly
3. Restart Kilo Code if needed

```bash
# Check available modes
/mode list

# Verify configuration
cat .kilocodemodes
```

#### Issue 2: Mode Not Applying Correct Behavior

**Problem**: Mode doesn't seem to be using its specialized behavior

**Solution**:
1. Verify you've switched to the correct mode
2. Check if the mode's custom instructions are properly configured
3. Be explicit about what you want the mode to do

```bash
# Explicitly switch mode
/mode code-reviewer

# Be specific in your request
"Please conduct a thorough code review of the tutor service, focusing on security and performance"
```

#### Issue 3: Cross-Package Type Errors

**Problem**: TypeScript errors when using types from other packages

**Solution**:
1. Ensure packages are built in dependency order
2. Check TypeScript path configuration
3. Verify package dependencies are correctly declared

```bash
# Build in correct order
pnpm --filter models build
pnpm --filter common build
pnpm --filter dataservice build

# Check TypeScript configuration
cat tsconfig.json
```

#### Issue 4: Mode Switching Loses Context

**Problem**: When switching modes, previous context is lost

**Solution**:
1. Save important context before switching
2. Use the Documentation Specialist mode to create reference documents
3. Re-establish context when switching back

```bash
# Before switching
/mode docs-specialist
"Save the current implementation details for the tutor booking feature"

# Switch modes
/mode frontend-specialist

# Re-establish context
"Continue working on the tutor booking feature based on the saved documentation"
```

#### Issue 5: Performance Issues with Large Monorepo

**Problem**: Slow performance when working with the entire monorepo

**Solution**:
1. Focus on specific packages using filters
2. Use Turbo for efficient builds
3. Limit the scope of mode operations

```bash
# Work with specific package
pnpm --filter web dev

# Use Turbo for efficient builds
pnpm build

# Limit mode scope
/mode code-simplifier
"Focus only on the tutor card component in web/components/featured-tutors/"
```

### Getting Help

If you encounter issues not covered here:

1. **Check the mode configuration**:
   ```bash
   cat .kilocodemodes
   ```

2. **Verify package structure**:
   ```bash
   pnpm list --depth=0
   ```

3. **Check TypeScript configuration**:
   ```bash
   cat tsconfig.json
   ```

4. **Review build logs**:
   ```bash
   pnpm build
   ```

---

## Advanced Techniques

### Creating Custom Mode Combinations

You can create custom workflows by combining modes in specific sequences:

```bash
# Example: Feature Development Workflow
1. /mode docs-specialist
   "Create feature specification and API documentation"

2. /mode code-simplifier
   "Implement core business logic with clean, maintainable code"

3. /mode frontend-specialist
   "Create user interface with accessibility and performance in mind"

4. /mode code-simplifier
   "Refactor the implementation for better maintainability"

5. /mode code-reviewer
   "Conduct comprehensive review of the entire feature"
```

### Mode Persistence

Some tasks require maintaining mode state across multiple operations:

```bash
# Stay in Code Reviewer mode for multiple reviews
/mode code-reviewer

"Review the tutor service"
"Review the user service"
"Review the authentication system"
```

### Context Preservation

To preserve context when switching modes:

```bash
# Save context before switching
/mode docs-specialist
"Document the current state of the tutor search implementation"

# Switch to another mode
/mode frontend-specialist

# Reference the saved context
"Based on the documented search implementation, optimize the UI components"
```

### Batch Operations

For operations affecting multiple packages:

```bash
/mode code-simplifier
"Refactor the error handling across all services in dataservice/"

/mode code-reviewer
"Review all API endpoints for security vulnerabilities"

/mode docs-specialist
"Update all API documentation to reflect recent changes"
```

---

## Conclusion

This guide provides a comprehensive approach to using Kilo Code modes for the EducatedPlanet project. By following these patterns and best practices, you can achieve the same specialized functionality you had with Claude subagents while taking advantage of Kilo Code's mode system.

### Key Takeaways

1. **Understand each mode's strengths** and use them appropriately
2. **Follow the recommended mode sequences** for different types of tasks
3. **Respect the monorepo structure** and development order
4. **Use modes consistently** to maintain code quality
5. **Document your work** to preserve context across mode switches

### Next Steps

1. Practice switching between modes with simple tasks
2. Implement a small feature using the recommended mode sequence
3. Create your own custom workflows based on your project needs
4. Share your experiences and contribute to improving the workflow

For additional help or questions, refer to the Kilo Code documentation or the EducatedPlanet project's existing documentation.