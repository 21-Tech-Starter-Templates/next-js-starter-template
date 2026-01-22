# Next.js Dashboard Starter Template - Complete Documentation

This is a comprehensive Next.js dashboard starter template with TypeScript, ShadCN/UI components, NextAuth authentication, and role-based access control (RBAC). This template provides a production-ready foundation for building modern web applications with advanced features.

## 🎯 **Overview**

This starter template includes:

- **Modern Dashboard Interface** with collapsible sidebar navigation
- **Authentication System** with JWT tokens and session management
- **Role-Based Access Control (RBAC)** with permissions and abilities
- **Command Palette** (Cmd+K) for quick navigation
- **Data Tables** with sorting, filtering, and pagination
- **Form Components** with validation and error handling
- **Theme System** with light/dark mode support
- **Responsive Design** optimized for all devices
- **TypeScript** with strict configuration
- **Production Ready** with proper error boundaries and loading states

## 🛠️ **Tech Stack**

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5+ (strict mode)
- **Authentication**: NextAuth.js v5 with JWT strategy + RBAC
- **Styling**: Tailwind CSS v4 + ShadCN/UI components
- **Components**: ShadCN/UI + Radix UI primitives (50+ components)
- **Schema Validations**: Zod for type-safe validation
- **State Management**: Zustand for client state
- **Search Params State**: Nuqs (type-safe URL state management)
- **Data Tables**: TanStack Table v8 + custom data table components
- **Forms**: React Hook Form with Zod resolvers
- **Command Interface**: Kbar for Cmd+K command palette
- **Icons**: @tabler/icons-react (1000+ icons)
- **Linting**: ESLint v9 with strict TypeScript rules
- **Pre-commit Hooks**: Husky for code quality
- **Formatting**: Prettier with automatic formatting
- **Package Manager**: pnpm for faster installs
- **Environment**: Node.js 18+

## 🚀 **Quick Start**

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url> my-dashboard-app
cd my-dashboard-app

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example.txt .env.local

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file with these required variables:

```env
# Authentication
AUTH_SECRET="your-auth-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
AUTH_SERVICE="http://localhost:8000/api/v1"

# Optional: Database URLs, External APIs, etc.
DATABASE_URL="your-database-url"
```

### First Run

1. Start the development server: `pnpm dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Use the login page with your credentials
4. Navigate to `/dashboard` to see the main interface

## 📁 **Detailed Project Structure**

```
/
├── .copilot/                   # GitHub Copilot instructions
│   └── instructions.md         # This file - project patterns and conventions
├── .vscode/                    # VS Code workspace settings
├── .husky/                     # Git hooks configuration
├── .next/                      # Next.js build output (generated)
├── node_modules/               # Dependencies (generated)
├── public/                     # Static assets
│   └── next.svg
├── types/                      # Global TypeScript definitions
│   ├── auth.ts                 # NextAuth type extensions
│   ├── css.d.ts                # CSS module types
│   └── next-auth.d.ts          # NextAuth module augmentation
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (login)
│   │   ├── theme.css           # Theme definitions
│   │   ├── global-error.tsx    # Global error boundary
│   │   ├── not-found.tsx       # 404 page
│   │   ├── favicon.ico         # Favicon
│   │   ├── api/                # API routes
│   │   │   └── auth/           # NextAuth API routes
│   │   └── dashboard/          # Protected dashboard area
│   │       ├── layout.tsx      # Dashboard layout with sidebar
│   │       ├── page.tsx        # Main dashboard page (redirects to overview)
│   │       ├── master/         # Master data management
│   │       │   └── dzongkhag/  # Dzongkhag management feature
│   │       │       ├── page.tsx    # Main dzongkhag list page
│   │       │       └── _components/ # Feature-specific components
│   │       │           ├── add-dzongkhag-dialog-box.tsx
│   │       │           ├── delete-dzongkhag-dialog.tsx
│   │       │           ├── dzongkhag-listing.tsx
│   │       │           ├── update-dzongkhag-dialog-box.tsx
│   │       │           └── dzongkhag-tables/
│   │       └── overview/       # Dashboard overview
│   ├── components/
│   │   ├── ui/                 # ShadCN/UI base components (50+ components)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── table/          # Table components
│   │   │   └── ... (more UI components)
│   │   ├── forms/              # Reusable form components
│   │   │   ├── form-input.tsx
│   │   │   ├── form-select.tsx
│   │   │   ├── form-textarea.tsx
│   │   │   ├── form-checkbox.tsx
│   │   │   ├── form-date-picker.tsx
│   │   │   ├── form-file-upload.tsx
│   │   │   ├── form-radio-group.tsx
│   │   │   ├── form-slider.tsx
│   │   │   ├── form-switch.tsx
│   │   │   └── demo-form.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── info-sidebar.tsx
│   │   │   ├── page-container.tsx
│   │   │   ├── providers.tsx
│   │   │   ├── user-nav.tsx
│   │   │   └── ThemeToggle/
│   │   ├── auth/               # Authentication components
│   │   │   ├── login-button.tsx
│   │   │   └── login-page.tsx
│   │   ├── kbar/               # Command palette (Cmd+K)
│   │   │   └── index.tsx
│   │   ├── modal/              # Modal components
│   │   │   └── alert-modal.tsx
│   │   ├── active-theme.tsx    # Theme management
│   │   ├── breadcrumbs.tsx     # Navigation breadcrumbs
│   │   ├── file-uploader.tsx   # File upload component
│   │   ├── form-card-skeleton.tsx # Loading skeletons
│   │   ├── icons.tsx           # Icon components
│   │   ├── nav-main.tsx        # Main navigation
│   │   ├── nav-projects.tsx    # Project navigation
│   │   ├── nav-user.tsx        # User navigation
│   │   ├── org-switcher.tsx    # Organization switcher
│   │   ├── search-input.tsx    # Search input
│   │   ├── theme-selector.tsx  # Theme selection
│   │   └── user-avatar-profile.tsx # User profile avatar
│   ├── lib/                    # Utility functions
│   │   ├── utils.ts            # cn() and other utilities
│   │   ├── font.ts             # Font configuration
│   │   ├── format.ts           # Formatting functions
│   │   ├── data-table.ts       # Data table utilities
│   │   ├── enum-text-format.ts # Enum formatting
│   │   ├── parsers.ts          # Data parsers
│   │   └── searchparams.ts     # URL search params utilities
│   ├── types/                  # TypeScript definitions
│   │   ├── index.ts            # Main type exports
│   │   ├── base-form.ts        # Form component types
│   │   ├── data-table.ts       # Data table types
│   │   └── api-error-response.ts # API error types
│   ├── config/                 # Configuration files
│   │   ├── nav-config.ts       # Navigation configuration
│   │   ├── data-table.ts       # Table configuration
│   │   └── infoconfig.ts       # Info sidebar config
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-breadcrumbs.tsx
│   │   ├── use-callback-ref.ts
│   │   ├── use-callback-ref.tsx
│   │   ├── use-controllable-state.tsx
│   │   ├── use-data-table.ts
│   │   ├── use-debounce.tsx
│   │   ├── use-debounced-callback.ts
│   │   ├── use-media-query.ts
│   │   ├── use-mobile.tsx
│   │   ├── use-multistep-form.tsx
│   │   └── use-nav.ts
│   ├── actions/                # Server actions
│   │   ├── instance.ts         # Base action instance
│   │   └── common/
│   │       └── dzongkhag-actions.ts
│   ├── constants/              # Application constants
│   ├── auth.config.ts          # NextAuth configuration
│   ├── auth.ts                 # NextAuth setup
│   └── proxy.ts                # API proxy configuration
├── .env.example.txt            # Environment variables template
├── .env.local                  # Local environment variables (git-ignored)
├── .gitignore                  # Git ignore rules
├── .npmrc                      # npm configuration
├── .nvmrc                      # Node version specification
├── .prettierignore             # Prettier ignore rules
├── .prettierrc                 # Prettier configuration
├── components.json             # ShadCN/UI configuration
├── documentation.md            # Project documentation
├── eslint.config.js            # ESLint configuration
├── LICENSE                     # License file
├── next-env.d.ts              # Next.js TypeScript definitions
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── pnpm-lock.yaml            # pnpm lockfile
├── postcss.config.js         # PostCSS configuration
├── README.md                 # Project README
└── tsconfig.json             # TypeScript configuration
```

## 🔐 **Authentication & Authorization**

### NextAuth.js Configuration

The template uses NextAuth.js v5 with a custom credentials provider:

**Features:**

- JWT-based session management
- "Remember Me" functionality (7 days vs 24 hours)
- Automatic token refresh
- Session persistence with Redis (optional)
- Role-based access control (RBAC)
- Environment-based configuration

**Session Structure:**

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  roleType: string;
  organizationId?: string;
  roles: Array<{
    id: string;
    name: string;
    permissions: Array<{
      id: string;
      name: string;
    }>;
  }>;
  ability: Array<
    | string
    | {
        name: string;
        action: string;
        subject: string;
      }
  >;
}
```

### RBAC Implementation

**Navigation Filtering:**

```typescript
// Automatic filtering based on user abilities
const filteredNavItems = useFilteredNavItems(navItems);

// Check specific permissions
const { hasAbility } = useUserAbilities();
const canManageUsers = hasAbility('manage:users');

// Super admin access
// Users with 'manage:all' ability see everything
```

**Permission Patterns:**

- `'manage:all'` - Super admin access to everything
- `'read:users'` - Read access to user data
- `'manage:users'` - Full user management
- `'create:content'` - Content creation permissions

## 🎨 **UI Components & Theming**

### ShadCN/UI Integration

The template includes 50+ pre-configured ShadCN/UI components:

**Core Components:**

- `Button` - Multiple variants and sizes
- `Input`, `Textarea` - Form inputs with validation
- `Card`, `Dialog`, `Sheet` - Layout components
- `Table`, `DataTable` - Advanced table functionality
- `Sidebar`, `Navigation` - Layout navigation
- `Form` components - React Hook Form integration

**Advanced Components:**

- `Command` - Command palette interface
- `Calendar`, `DatePicker` - Date selection
- `Select`, `Combobox` - Dropdown selections
- `Accordion`, `Tabs` - Content organization
- `Charts` - Data visualization

### Theme System

**CSS Variables Configuration:**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}

[data-theme='dark'] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

**Theme Switching:**

- Built-in theme selector component
- System preference detection
- Persistent theme storage
- Smooth transitions between themes

## 📊 **Data Management**

### Server Actions Pattern

```typescript
'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createItem(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  // Validate permissions
  if (!hasPermission(session.user, 'create:items')) {
    throw new Error('Insufficient permissions');
  }

  // Business logic
  const result = await api.createItem(data);

  // Revalidate cache
  revalidatePath('/dashboard/items');

  return result;
}
```

### Data Tables

**TanStack Table Integration:**

- Sorting, filtering, pagination
- Column visibility controls
- Row selection functionality
- Export capabilities
- Responsive design

```typescript
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel()
});
```

### Form Handling

**React Hook Form + Zod:**

```typescript
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: {
    title: '',
    status: 'active'
  }
});
```

**Custom Form Components:**

- `FormInput` - Text inputs with validation
- `FormSelect` - Dropdown selections
- `FormTextarea` - Multi-line text
- `FormCheckbox` - Boolean inputs
- `FormDatePicker` - Date selection
- `FormFileUpload` - File upload handling

## 🧩 **Custom Hooks**

### Navigation & State Management

- `useFilteredNavItems` - RBAC-based nav filtering
- `useUserAbilities` - Permission checking
- `useUserRoles` - Role-based logic
- `useBreadcrumbs` - Dynamic breadcrumb generation
- `useDataTable` - Table state management
- `useMediaQuery` - Responsive design hooks
- `useDebounce` - Input debouncing
- `useMultistepForm` - Multi-step form logic

### Performance Hooks

- `useCallbackRef` - Stable callback references
- `useControllableState` - Controlled/uncontrolled state
- `useDebouncedCallback` - Debounced function calls

## 📱 **Responsive Design**

### Mobile-First Approach

**Breakpoints:**

- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+
- `2xl`: 1536px+

**Mobile Features:**

- Collapsible sidebar navigation
- Touch-friendly interactions
- Responsive data tables
- Mobile-optimized forms
- Gesture support

### Layout Components

- `PageContainer` - Consistent page wrapper
- `AppSidebar` - Collapsible navigation
- `Header` - Top navigation bar
- `InfoSidebar` - Right-side information panel

## ⚡ **Performance Optimization**

### Code Splitting

```typescript
// Dynamic imports for heavy components
const ChartComponent = dynamic(() => import('./ChartComponent'), {
  loading: () => <Skeleton className="h-[400px]" />
});
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={200}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Caching Strategy

- Server-side caching with `revalidatePath`
- Client-side query caching
- Static generation where appropriate
- Incremental Static Regeneration (ISR)

## 🛠️ **Development Tools**

### Code Quality

**ESLint Configuration:**

- TypeScript strict rules
- React Hook rules
- Accessibility checks
- Import order enforcement
- Unused variable detection

**Prettier Setup:**

- Automatic formatting on save
- Consistent code style
- Integration with ESLint

**Husky Pre-commit Hooks:**

```json
{
  "pre-commit": "lint-staged",
  "pre-push": "pnpm type-check"
}
```

### VS Code Integration

**Recommended Extensions:**

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- GitLens

**Workspace Settings:**

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🚀 **Deployment**

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables

**Production Setup:**

```env
# Authentication
AUTH_SECRET="production-secret"
NEXTAUTH_URL="https://yourdomain.com"
AUTH_SERVICE="https://api.yourdomain.com/v1"

# Database
DATABASE_URL="your-production-db-url"

# External Services
REDIS_URL="your-redis-url"
```

### Docker Deployment

```dockerfile
FROM node:18-alpine AS base
# Install pnpm
RUN npm install -g pnpm

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## 🧪 **Testing Strategy**

### Testing Tools (Optional Setup)

**Unit Testing:**

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

**E2E Testing:**

```bash
pnpm add -D @playwright/test
```

**Component Testing:**

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

## 📈 **Monitoring & Analytics**

### Error Tracking

```typescript
// error.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Performance Monitoring

```typescript
// Web Vitals tracking
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

## 🔧 **Customization Guide**

### Adding New Features

1. **Create Feature Directory:**

```
src/app/dashboard/my-feature/
├── page.tsx
├── loading.tsx
├── error.tsx
└── _components/
    └── my-feature-table.tsx
```

2. **Add Navigation:**

```typescript
// config/nav-config.ts
{
  title: 'My Feature',
  url: '/dashboard/my-feature',
  icon: 'settings',
  access: {
    permission: 'read:my-feature'
  }
}
```

3. **Create Server Actions:**

```typescript
// actions/my-feature-actions.ts
'use server';

export async function createMyFeature(data: FormData) {
  // Implementation
}
```

### Extending Authentication

**Adding OAuth Providers:**

```typescript
// auth.config.ts
import Google from 'next-auth/providers/google';

providers: [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })
  // ... existing providers
];
```

**Custom User Fields:**

```typescript
// types/next-auth.d.ts
declare module 'next-auth' {
  interface User {
    // Add your custom fields
    department?: string;
    employeeId?: string;
  }
}
```

## 🎯 **Best Practices**

### Import Order

```tsx
// 1. React and Next.js
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 3. UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Custom components
import { FormInput } from '@/components/forms/form-input';

// 5. Utils and config
import { cn } from '@/lib/utils';
import { navItems } from '@/config/nav-config';

// 6. Types
import type { User } from '@/types';
```

### Component Patterns

#### Client Components

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  // Always define prop interfaces
}

export default function ComponentName({ prop }: Props) {
  // Component logic
  return <div>Content</div>;
}
```

#### Server Components (default)

```tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function PageName({ params }: Props) {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return <div>Content</div>;
}
```

### Form Components

Use the established form component pattern:

```tsx
'use client';

import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { BaseFormFieldProps } from '@/types/base-form';

interface FormComponentProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  // Additional props
}

function FormComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  disabled
}: FormComponentProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {required && '*'}
            </FormLabel>
          )}
          <FormControl>{/* Form input component */}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

### Layout Structure

#### Dashboard Pages

```tsx
// app/dashboard/[feature]/page.tsx
import { PageContainer } from '@/components/layout/page-container';
import { Breadcrumbs } from '@/components/breadcrumbs';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Feature', link: '/dashboard/feature' }
];

export default function FeaturePage() {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
          {/* Actions */}
        </div>
        {/* Page content */}
      </div>
    </PageContainer>
  );
}
```

### Navigation Configuration

Add new nav items to `config/nav-config.ts`:

```tsx
{
  title: 'Feature Name',
  url: '/dashboard/feature',
  icon: 'iconName', // From @tabler/icons-react
  isActive: false,
  shortcut: ['f', 'n'],
  items: [], // For sub-items
  access: {
    requireOrg: true,
    permission: 'feature:read' // Optional RBAC
  }
}
```

### Styling Guidelines

- Use `cn()` utility for conditional classes
- Prefer Tailwind utilities over custom CSS
- Use consistent spacing: `space-y-4`, `gap-4`, `p-4`, etc.
- Follow ShadCN/UI component patterns
- Support dark mode with CSS variables

```tsx
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Always accept className prop
)}>
```

### Authentication

#### Protected Routes

```tsx
// In layout or page
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  // Page content
}
```

#### Client-side Auth

```tsx
'use client';

import { useSession } from 'next-auth/react';

export default function ClientComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  // Component content
}
```

### TypeScript Patterns

- Always define interfaces for props and data
- Use generic types for reusable components
- Export types from `types/index.ts`
- Use `@/*` path aliases consistently

```tsx
// types/feature.ts
export interface Feature {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// Component usage
interface FeatureCardProps {
  feature: Feature;
  onClick?: (feature: Feature) => void;
}
```

### Error Handling

- Use Next.js error boundaries
- Provide fallback UI for loading states
- Handle form validation with Zod schemas

```tsx
// error.tsx
'use client';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### File Naming

- Use kebab-case for files: `user-profile.tsx`
- Use PascalCase for components: `UserProfile`
- Use camelCase for functions and variables
- Use UPPER_CASE for constants

## Key Libraries Usage

### ShadCN/UI Components

Always import from `@/components/ui/[component]` and use established patterns.

### Form Validation

```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email')
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    name: '',
    email: ''
  }
});
```

### Server Actions

```tsx
'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createFeature(formData: FormData) {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  // Action logic

  revalidatePath('/dashboard/features');
}
```

## Best Practices

1. **Performance**: Use dynamic imports for heavy components
2. **Accessibility**: Include proper ARIA labels and semantic HTML
3. **SEO**: Add metadata to pages
4. **Security**: Always validate server actions and API routes
5. **UX**: Provide loading states and error boundaries
6. **Code Quality**: Use TypeScript strictly, no `any` types

Follow these patterns to maintain consistency across the codebase and ensure optimal integration with the existing template structure.
