# Next.js Starter Template - Copilot Instructions

This is a Next.js dashboard starter template with TypeScript, ShadCN/UI, and NextAuth. Follow these patterns when generating code.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS v4 + ShadCN/UI
- **Components**: ShadCN/UI + Radix UI primitives
- **Schema Validations**: Zod
- **State Management**: Zustand
- **Search Params State**: Nuqs (type-safe URL state management)
- **Tables**: TanStack Table + Data Table components
- **Forms**: React Hook Form with Zod validation
- **Command Interface**: Kbar (Cmd+K palette)
- **Icons**: @tabler/icons-react
- **Linting**: ESLint with strict rules
- **Pre-commit Hooks**: Husky
- **Formatting**: Prettier
- **Package Manager**: pnpm

## Project Structure

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

## Code Conventions

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
