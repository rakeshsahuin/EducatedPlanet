# Setup Instructions for EducatedPlanet Project

## 📋 Overview

This guide covers setting up:
1. **CLAUDE.md** - Main project configuration file
2. **UI Design Expert Subagent** - Specialized Shadcn/UI expert
3. **Project Structure** - Separating main app and admin panel

---

## 🗂️ Project Structure

Since the admin panel will be a separate project:

```
Projects/
├── educatedplanet-web/          # Main web application
│   ├── .claude/
│   │   ├── CLAUDE.md            # Main app configuration
│   │   └── agents/
│   │       └── ui-design-expert.md
│   ├── app/
│   ├── components/
│   └── ...
│
└── educatedplanet-admin/        # Admin panel (separate project)
    ├── .claude/
    │   ├── CLAUDE.md            # Admin-specific configuration
    │   └── agents/
    │       └── ui-design-expert.md
    ├── app/
    ├── components/
    └── ...
```

---

## 📝 Part 1: Setting Up CLAUDE.md

### Step 1: Create Project-Level CLAUDE.md

**For Main Web Application:**

```bash
# Navigate to your main project
cd educatedplanet-web

# Create .claude directory if it doesn't exist
mkdir -p .claude

# Create CLAUDE.md file
touch .claude/CLAUDE.md
```

**For Admin Panel:**

```bash
# Navigate to your admin project
cd educatedplanet-admin

# Create .claude directory
mkdir -p .claude

# Create CLAUDE.md file
touch .claude/CLAUDE.md
```

### Step 2: Copy CLAUDE.md Content

Copy the content from the provided `CLAUDE.md` file (artifact [38]) into your project's `.claude/CLAUDE.md` file.

**Customize for each project:**

**Main Web App** (`educatedplanet-web/.claude/CLAUDE.md`):
```markdown
# EducatedPlanet - Web Application

# 🎯 Project Context

**Project**: EducatedPlanet - Main Web Application (Student/Tutor-facing)
**Domain**: educatedplanet.net
**Tech Stack**: Next.js 14+, Shadcn/UI (Nature Theme), Tailwind CSS, MongoDB, TypeScript

## Core Features
- Landing page with search
- Tutor listing and discovery
- Tutor profile pages
- User authentication (OTP)
- Review system
- Contact/Connect functionality

# ... (rest of the configuration)
```

**Admin Panel** (`educatedplanet-admin/.claude/CLAUDE.md`):
```markdown
# EducatedPlanet - Admin Panel

# 🎯 Project Context

**Project**: EducatedPlanet - Admin Dashboard
**Subdomain**: admin.educatedplanet.net
**Tech Stack**: Next.js 14+, Shadcn/UI (Nature Theme), Tailwind CSS, MongoDB, TypeScript

## Core Features
- Dashboard with analytics
- Tutor approval system
- User management
- Subject CRUD
- Review moderation
- Admin authentication

# ... (rest of the configuration)
```

### Step 3: Verify CLAUDE.md Setup

```bash
# Check that the file exists and is readable
cat .claude/CLAUDE.md | head -20

# File should be picked up automatically by Claude Code
# No restart needed
```

---

## 👤 Part 2: Setting Up UI Design Expert Subagent

### Step 1: Create Agents Directory

```bash
# For main web app
cd educatedplanet-web
mkdir -p .claude/agents

# For admin panel
cd educatedplanet-admin
mkdir -p .claude/agents
```

### Step 2: Create Subagent File

```bash
# In each project
touch .claude/agents/ui-design-expert.md
```

### Step 3: Copy Subagent Content

Copy the content from `ui-design-expert.md` (artifact [39]) into `.claude/agents/ui-design-expert.md` in both projects.

**The subagent file structure:**
```markdown
---
name: ui-design-expert
description: Specialized in Shadcn/UI and Nature theme design...
tools: Read, Write, Edit, Search, Glob, Bash, Inspect
---

# UI Design Expert - EducatedPlanet Specialist

[Rest of the subagent configuration]
```

### Step 4: Verify Subagent Installation

```bash
# Check file exists
ls -la .claude/agents/

# Verify content
head -30 .claude/agents/ui-design-expert.md

# List all available agents in Claude Code
# Run this in Claude Code chat:
# "List all available subagents"
```

---

## 🎨 Part 3: Apply Nature Theme

### Step 1: Initialize Shadcn/UI

```bash
# In each project directory
npx shadcn-ui@latest init
```

When prompted, select:
- TypeScript: **Yes**
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

### Step 2: Apply Nature Theme

Create a file `nature-theme.json` with the content from your attached file, then apply it:

```bash
# Method 1: Manual (Recommended)
# Copy the CSS variables from nature.json to your app/globals.css

# Method 2: Using tweakcn (if available)
npx tweakcn apply nature
```

### Step 3: Update globals.css

Add Nature theme colors to your `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Nature Theme - Light Mode */
    --background: 0.9711 0.0074 80.7211;
    --foreground: 0.3000 0.0358 30.2042;
    --primary: 0.5234 0.1347 144.1672;
    --primary-foreground: 1.0000 0 0;
    --secondary: 0.9571 0.0210 147.6360;
    --secondary-foreground: 0.4254 0.1159 144.3078;
    --accent: 0.8952 0.0504 146.0366;
    --muted: 0.9370 0.0142 74.4218;
    --border: 0.8805 0.0208 74.6428;
    --radius: 0.5rem;
    
    /* Typography */
    --font-sans: 'Montserrat', sans-serif;
    --font-serif: 'Merriweather', serif;
    --font-mono: 'Source Code Pro', monospace;
  }
  
  .dark {
    /* Nature Theme - Dark Mode */
    --background: 0.2683 0.0279 150.7681;
    --foreground: 0.9423 0.0097 72.6595;
    --primary: 0.6731 0.1624 144.2083;
    --primary-foreground: 0.2157 0.0453 145.7256;
    /* ... rest of dark mode colors */
  }
  
  body {
    letter-spacing: var(--tracking-normal);
  }
}
```

### Step 4: Install Google Fonts

Add to your `app/layout.tsx`:

```typescript
import { Montserrat, Merriweather, Source_Code_Pro } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const merriweather = Merriweather({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})

const sourceCodePro = Source_Code_Pro({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

---

## 🔧 Part 4: Configure MCP Server (Shadcn)

### Step 1: Check if Shadcn MCP is Installed

You mentioned you already installed the Shadcn MCP server. Verify it's configured:

```bash
# Check Claude Code settings
cat ~/.claude.json | grep -A 10 "shadcn"
```

### Step 2: Verify MCP Server Configuration

Your `~/.claude.json` should have:

```json
{
  "mcpServers": {
    "shadcn": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@pixeeai/mcp-shadcn"
      ],
      "env": {}
    }
  }
}
```

### Step 3: Test Shadcn MCP

In Claude Code, ask:
```
"List all available Shadcn components"
"Apply the nature theme to this project"
```

---

## 🚀 Part 5: Usage Examples

### Using CLAUDE.md Context

Claude Code will automatically read `.claude/CLAUDE.md` for project context. Just start coding:

```
You: "Create a tutor card component"

Claude: [Automatically uses CLAUDE.md context]
- Applies Nature theme colors
- Uses Shadcn Card component
- Follows education platform design principles
- Includes proper TypeScript types
```

### Invoking UI Design Expert Subagent

**Automatic Invocation** (Claude decides when to use):
```
You: "Design the landing page hero section"

Claude: [Automatically delegates to ui-design-expert]
```

**Explicit Invocation**:
```
You: "Use the ui-design-expert to create a tutor search interface"

Claude: [Explicitly calls ui-design-expert subagent]
```

**@ Mention**:
```
You: "@ui-design-expert Design a mobile-friendly navigation menu"
```

### Checking Active Agents

```
You: "/agents"

Claude: [Shows list of available agents]
- ui-design-expert ✓
```

---

## 📊 Part 6: Verification Checklist

After setup, verify everything is working:

### CLAUDE.md
- [ ] File exists at `.claude/CLAUDE.md`
- [ ] Contains project-specific configuration
- [ ] Different for web app vs admin panel
- [ ] Claude recognizes project context automatically

### UI Design Expert Subagent
- [ ] File exists at `.claude/agents/ui-design-expert.md`
- [ ] Has proper frontmatter (name, description, tools)
- [ ] Claude can invoke it automatically
- [ ] Can be explicitly called with `@ui-design-expert`

### Nature Theme
- [ ] Shadcn/UI initialized
- [ ] Nature theme CSS variables in `globals.css`
- [ ] Google Fonts imported (Montserrat, Merriweather)
- [ ] Dark mode support configured
- [ ] Components use Nature theme colors

### MCP Server
- [ ] Shadcn MCP configured in `~/.claude.json`
- [ ] Can list Shadcn components
- [ ] Can apply theme via MCP

---

## 🎯 Part 7: Quick Start Workflow

### For Main Web App

```bash
# 1. Navigate to project
cd educatedplanet-web

# 2. Set up Claude configuration
mkdir -p .claude/agents
# Copy CLAUDE.md and ui-design-expert.md

# 3. Initialize Shadcn
npx shadcn-ui@latest init

# 4. Apply Nature theme
# Edit globals.css with Nature colors

# 5. Start developing
npm run dev

# 6. Test in Claude Code
# "Create a landing page with tutor search"
```

### For Admin Panel

```bash
# 1. Navigate to admin project
cd educatedplanet-admin

# 2. Set up Claude configuration
mkdir -p .claude/agents
# Copy CLAUDE.md and ui-design-expert.md (same content)

# 3. Initialize Shadcn
npx shadcn-ui@latest init

# 4. Apply Nature theme
# Edit globals.css with Nature colors

# 5. Start developing
npm run dev

# 6. Test in Claude Code
# "Create an admin dashboard with stats cards"
```

---

## 🛠️ Part 8: Troubleshooting

### Issue: Claude doesn't recognize CLAUDE.md

**Solution:**
```bash
# Ensure file is in project root .claude/ directory
ls -la .claude/CLAUDE.md

# Check file permissions
chmod 644 .claude/CLAUDE.md

# Restart Claude Code
```

### Issue: Subagent not showing up

**Solution:**
```bash
# Verify frontmatter format
head -10 .claude/agents/ui-design-expert.md

# Should start with:
# ---
# name: ui-design-expert
# description: ...
# ---

# Check file naming (no spaces, kebab-case)
ls .claude/agents/
```

### Issue: Nature theme not applying

**Solution:**
```bash
# Verify globals.css has CSS variables
cat app/globals.css | grep "primary"

# Check tailwind.config.ts references CSS variables
cat tailwind.config.ts

# Restart dev server
npm run dev
```

### Issue: Fonts not loading

**Solution:**
```typescript
// Ensure fonts are imported in layout.tsx
import { Montserrat } from 'next/font/google'

// And applied to <html> tag
<html className={montserrat.variable}>
```

---

## 📚 Additional Resources

### Documentation Links
- [Claude Code Subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [Next.js 14 App Router](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

### Community Resources
- [Awesome Claude Code Subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
- [Claude Code Orchestra](https://github.com/0ldh/claude-code-agents-orchestra)
- [Shadcn Themes](https://ui.shadcn.com/themes)

---

## ✅ Success Criteria

You've successfully set up everything when:

1. **Claude Code recognizes your project context** from CLAUDE.md
2. **UI Design Expert subagent** can be invoked automatically or explicitly
3. **Nature theme** is applied correctly with proper colors and fonts
4. **Shadcn components** work with Nature theme styling
5. **Dark mode** switches between light/dark Nature variants
6. **Both projects** (web + admin) have separate configurations

---

**Need Help?** 
- Ask Claude: "Verify my EducatedPlanet setup"
- Test subagent: "@ui-design-expert create a sample component"
- Check theme: "Show me the current Nature theme colors"

**Ready to Build!** 🚀
Start with: "Create the landing page for EducatedPlanet with hero section and tutor search"