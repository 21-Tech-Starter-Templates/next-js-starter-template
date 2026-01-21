# Next.js Starter Template Documentation

A comprehensive admin dashboard starter template built with Next.js 16, featuring authentication, role-based access control, server actions, TanStack tables, and more.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication (Next Auth)](#authentication-next-auth)
4. [Role-Based Access Control](#role-based-access-control)
5. [Partial Prerendering (PPR)](#partial-prerendering-ppr)
6. [Server Actions](#server-actions)
7. [TanStack Table](#tanstack-table)
8. [URL State Management (nuqs)](#url-state-management-nuqs)
9. [Forms & Components](#forms--components)
10. [Project Structure](#project-structure)
11. [Deployment](#deployment)

## Overview

This template provides a production-ready dashboard UI with:

- **Framework**: Next.js 16 with App Router
- **Authentication**: NextAuth.js v5 with JWT strategy
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table with server-side pagination
- **State Management**: URL state with nuqs + Zustand
- **Commands**: Cmd+K interface with kbar

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd next-js-starter-template

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example.txt .env.local
```

### Environment Variables

```bash
# .env.local
AUTH_SECRET=your-super-secret-key
AUTH_SERVICE=https://your-auth-api.com/api
COMMON_SERVICE=https://your-common-api.com/api
NEXTAUTH_URL=http://localhost:3000
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Authentication (Next Auth)

### Configuration

The authentication system uses NextAuth.js v5 with JWT strategy and supports session duration based on "Remember Me" functionality.

#### Key Files:

- [`src/auth.config.ts`](src/auth.config.ts) - NextAuth configuration
- [`src/auth.ts`](src/auth.ts) - Auth instance
- [`src/proxy.ts`](src/proxy.ts) - Middleware for route protection
- [`types/next-auth.d.ts`](types/next-auth.d.ts) - Type definitions

### Features

#### 1. JWT Strategy with Token Refresh

```typescript
// Automatic token refresh 5 minutes before expiry
// Session duration based on "Remember Me" checkbox
const SESSION_MAX_AGE_REMEMBER = 7 * 24 * 60 * 60; // 7 days
const SESSION_MAX_AGE_DEFAULT = 24 * 60 * 60; // 24 hours
```

#### 2. Credentials Provider

```typescript
// Login with email/password + remember me option
const result = await signIn('credentials', {
  email: 'user@example.com',
  password: 'password',
  rememberMe: 'true', // extends session to 7 days
  redirect: false
});
```

#### 3. Session Management

```typescript
// Get session in server components
import { auth } from '@/auth';

const session = await auth();
console.log(session.user.fullName);
console.log(session.accessToken);
```

#### 4. Route Protection

```typescript
// Middleware automatically redirects:
// - Unauthenticated users from /dashboard/* to /
// - Authenticated users from / to /dashboard
```

### Usage Examples

#### Login Component

```tsx
// src/components/auth/login-page.tsx
import { signIn } from 'next-auth/react';

const onSubmit = async (data) => {
  const result = await signIn('credentials', {
    email: data.email,
    password: data.password,
    rememberMe: data.rememberMe.toString(),
    redirect: false
  });

  if (result?.ok) {
    router.push('/dashboard');
  }
};
```

#### Logout

```tsx
import { signOut } from '@/auth';

// Server action
await signOut({ redirectTo: '/' });

// Client component
import { signOut } from 'next-auth/react';
await signOut({ callbackUrl: '/' });
```

#### Protect Server Components

```tsx
// src/app/dashboard/layout.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return <div>{children}</div>;
}
```

## Role-Based Access Control

The template includes a comprehensive RBAC system for navigation and page access control.

### Key Features

1. **Permission-based Navigation**: Navigation items can be filtered based on user permissions, roles, and organizational context.
2. **Page-level Access Control**: Components can restrict access based on user capabilities.
3. **Flexible Permission Format**: Supports both string and object permission formats.

### Configuration

#### Navigation Access Control

```typescript
// src/config/nav-config.ts
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    items: []
    // No access control - visible to all authenticated users
  },
  {
    title: 'User Management',
    url: '/dashboard/users',
    icon: 'users',
    items: [],
    // Require organization membership
    access: { requireOrg: true }
  },
  {
    title: 'Admin Panel',
    url: '/dashboard/admin',
    icon: 'settings',
    items: [],
    // Require specific permission
    access: {
      requireOrg: true,
      permission: 'admin:panel:access'
    }
  },
  {
    title: 'Premium Features',
    url: '/dashboard/premium',
    icon: 'star',
    items: [],
    // Require specific plan or feature
    access: {
      plan: 'pro',
      feature: 'premium_access'
    }
  }
];
```

#### Access Control Properties

```typescript
interface PermissionCheck {
  permission?: string; // Specific permission required
  plan?: string; // Subscription plan required
  feature?: string; // Feature flag required
  role?: string; // User role required
  requireOrg?: boolean; // Organization membership required
}
```

### User Permissions Structure

#### User Object with Permissions

```typescript
// User session includes roles and permissions
interface User {
  id: string;
  fullName: string;
  roles: Array<{
    id: string;
    name: string;
    permissions: Array<{
      id: string;
      name: string;
    }>;
  }>;
  // Flexible ability format
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

#### Permission Examples

```typescript
// String format (recommended)
user.ability = [
  'read:users',
  'write:posts',
  'admin:panel:access',
  'org:teams:manage'
];

// Object format (legacy support)
user.ability = [
  {
    name: 'User Management',
    action: 'read',
    subject: 'users'
  },
  {
    name: 'Post Creation',
    action: 'write',
    subject: 'posts'
  }
];
```

### Page-Level Access Control

#### Using PageContainer

```tsx
// src/components/layout/page-container.tsx
import PageContainer from '@/components/layout/page-container';

export default function AdminPage() {
  const hasAdminAccess = checkUserPermission('admin:panel:access');

  return (
    <PageContainer
      access={hasAdminAccess}
      accessFallback={<div>You need admin privileges to access this page.</div>}
      pageTitle="Admin Panel"
      pageDescription="System administration"
    >
      {/* Page content only shown if access=true */}
      <AdminContent />
    </PageContainer>
  );
}
```

#### Custom Access Control Hook

```typescript
// Custom hook example
function usePermissions() {
  const { data: session } = useSession();

  const hasPermission = (permission: string) => {
    if (!session?.user?.ability) return false;

    return session.user.ability.some((ability) =>
      typeof ability === 'string'
        ? ability === permission
        : ability.name === permission
    );
  };

  const hasRole = (role: string) => {
    return session?.user?.roles?.some((r) => r.name === role);
  };

  return { hasPermission, hasRole };
}
```

### Implementation Examples

#### Conditional Navigation

```tsx
// Navigation filtering happens automatically via nav-config.ts
// But you can also do manual checks:

function NavItem({ item }) {
  const { hasPermission } = usePermissions();

  if (item.access?.permission && !hasPermission(item.access.permission)) {
    return null; // Don't render this nav item
  }

  return <a href={item.url}>{item.title}</a>;
}
```

#### Server-Side Access Control

```tsx
// app/admin/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();

  const hasAdminAccess = session?.user?.ability?.includes('admin:panel:access');

  if (!hasAdminAccess) {
    redirect('/dashboard'); // or show 403 page
  }

  return <div>Admin content</div>;
}
```

## Partial Prerendering (PPR)

Next.js 16 introduces Partial Prerendering as an experimental feature that combines static and dynamic rendering.

### Configuration

Currently not enabled in the template, but can be activated by updating `next.config.ts`:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    ppr: true // Enable PPR
  }
  // ... other config
};
```

### How PPR Works

1. **Static Shell**: The initial page layout renders statically
2. **Dynamic Holes**: Interactive components stream in dynamically
3. **Suspense Boundaries**: Define what loads dynamically

### Implementation Example

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import StaticHeader from '@/components/static-header';
import DynamicUserStats from '@/components/dynamic-user-stats';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  return (
    <div>
      {/* Static content - prerendered */}
      <StaticHeader title="Dashboard" />

      {/* Dynamic content - streams in */}
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <DynamicUserStats />
      </Suspense>

      {/* More dynamic sections */}
      <Suspense fallback={<div>Loading charts...</div>}>
        <UserCharts />
      </Suspense>
    </div>
  );
}
```

### Benefits

- **Faster Initial Load**: Static shell renders immediately
- **Better SEO**: Search engines see content faster
- **Improved Core Web Vitals**: Better LCP and CLS scores
- **Progressive Enhancement**: Content streams in progressively

### Best Practices

1. **Identify Static vs Dynamic**: Separate static layout from dynamic data
2. **Use Suspense Boundaries**: Wrap dynamic components in Suspense
3. **Optimize Fallbacks**: Provide meaningful loading states
4. **Test Performance**: Measure real-world impact

## Server Actions

Server Actions provide a way to run server-side code directly from client components, eliminating the need for API routes in many cases.

### Key Files

- [`src/actions/`](src/actions/) - Server action definitions
- [`src/actions/instance.ts`](src/actions/instance.ts) - Authenticated HTTP headers helper

### Features

#### 1. Authenticated API Calls

```typescript
// src/actions/instance.ts
export async function instance(multipart?: boolean) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('No authentication token found');
  }

  return {
    Authorization: `Bearer ${session.accessToken}`,
    'Content-Type': multipart ? undefined : 'application/json',
    'x-session-id': session.sessionId // For activity tracking
  };
}
```

#### 2. Data Mutations with Cache Revalidation

```typescript
// src/actions/common/dzongkhag-actions.ts
'use server';

import { updateTag } from 'next/cache';
import { instance } from '../instance';

export async function createDzongkhags(formData: any) {
  try {
    const response = await fetch(`${API_URL}/dzongkhags`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        error: true,
        message: data?.error?.message || 'Failed to add dzongkhags'
      };
    }

    // Revalidate cache after successful mutation
    updateTag('dzongkhags');
    return data;
  } catch (error) {
    return { error: true, message: 'Failed to add dzongkhags' };
  }
}
```

### Usage Examples

#### 1. Form Submission with Server Actions

```tsx
// Client component using server action
'use client';

import { createDzongkhags } from '@/actions/common/dzongkhag-actions';
import { useTransition } from 'react';

export function DzongkhagForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createDzongkhags(formData);

      if (result.error) {
        console.error(result.message);
      } else {
        console.log('Success:', result);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Dzongkhag name" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

#### 2. Progressive Enhancement with Forms

```tsx
// Works without JavaScript
export function EnhancedForm() {
  return (
    <form action={createDzongkhags}>
      <input name="name" required />
      <button type="submit">Create Dzongkhag</button>
    </form>
  );
}
```

#### 3. Server Actions with Error Handling

```typescript
'use server';

export async function updateUserProfile(formData: FormData) {
  try {
    const name = formData.get('name') as string;

    // Validation
    if (!name || name.length < 2) {
      return { error: true, message: 'Name must be at least 2 characters' };
    }

    // API call
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
      headers: await instance()
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    revalidatePath('/profile');
    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    return { error: true, message: 'Something went wrong' };
  }
}
```

#### 4. Data Fetching with Server Actions

```typescript
'use server';

export async function getDzongkhags(searchParams: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const params = new URLSearchParams({
      page: searchParams.page?.toString() || '1',
      limit: searchParams.limit?.toString() || '10',
      ...(searchParams.search && { search: searchParams.search })
    });

    const response = await fetch(`${API_URL}/dzongkhags?${params}`, {
      headers: await instance(),
      next: { tags: ['dzongkhags'] } // For cache revalidation
    });

    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch dzongkhags');
  }
}
```

### Best Practices

1. **Error Handling**: Always return error states, don't throw
2. **Cache Revalidation**: Use `revalidatePath()` or `revalidateTag()` after mutations
3. **Type Safety**: Define proper TypeScript types for form data
4. **Loading States**: Use `useTransition()` for pending states
5. **Validation**: Validate data on the server, not just client

## TanStack Table

Advanced data tables with server-side pagination, filtering, and sorting using TanStack Table v8.

### Key Files

- [`src/components/ui/table/data-table.tsx`](src/components/ui/table/data-table.tsx) - Main table component
- [`src/hooks/use-data-table.ts`](src/hooks/use-data-table.ts) - Table state management hook
- [`src/types/data-table.ts`](src/types/data-table.ts) - Type definitions

### Features

#### 1. Server-Side Operations

```tsx
// Automatic URL state synchronization
export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems
}: DataTableProps<TData, TValue>) {
  // URL state management with nuqs
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1)
  );

  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger.withDefault(10)
  );

  // ... table implementation
}
```

#### 2. Column Definitions

```typescript
// Define table columns with metadata
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      label: 'User Name',
      placeholder: 'Search names...'
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      label: 'Email Address'
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      label: 'Account Status',
      variant: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editUser(row.original)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteUser(row.original.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];
```

### Usage Examples

#### 1. Basic Data Table

```tsx
'use client';

import { DataTable } from '@/components/ui/table/data-table';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export function UsersTable({
  users,
  totalUsers
}: {
  users: User[];
  totalUsers: number;
}) {
  return (
    <DataTable
      columns={columns}
      data={users}
      totalItems={totalUsers}
      pageSizeOptions={[10, 20, 50, 100]}
    />
  );
}
```

#### 2. Server Component with Data Fetching

```tsx
// app/users/page.tsx
import { getDzongkhags } from '@/actions/common/dzongkhag-actions';
import { DataTable } from '@/components/ui/table/data-table';
import { searchParamsCache } from '@/lib/searchparams';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  // Parse and validate search parameters
  const { page, limit, q } = searchParamsCache.parse(searchParams);

  // Fetch data with current parameters
  const { data: users, totalCount } = await getDzongkhags({
    page,
    limit,
    search: q || undefined
  });

  return (
    <div>
      <h1>Users Management</h1>
      <DataTable columns={userColumns} data={users} totalItems={totalCount} />
    </div>
  );
}
```

#### 3. Advanced Table with Custom Hook

```tsx
'use client';

import { useDataTable } from '@/hooks/use-data-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

export function AdvancedDataTable({ data, columns, totalItems }) {
  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / 10),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 }
    }
  });

  return (
    <div>
      {/* Custom search */}
      <input
        placeholder="Search..."
        onChange={(e) => {
          // Handle search with URL state
        }}
      />

      {/* Table */}
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort() ? 'cursor-pointer' : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽'
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

#### 4. Column Filtering

```typescript
// Define filterable columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'department',
    header: 'Department',
    meta: {
      variant: 'select',
      options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' }
      ]
    }
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    meta: {
      variant: 'range',
      range: [0, 200000],
      unit: 'USD'
    }
  }
];
```

### Features Included

1. **Pagination**: Server-side pagination with customizable page sizes
2. **Sorting**: Multi-column sorting with URL persistence
3. **Filtering**: Advanced filtering with multiple filter types
4. **Search**: Global search with debouncing
5. **Row Selection**: Multi-row selection with actions
6. **Column Visibility**: Toggle column visibility
7. **Loading States**: Skeleton loading components
8. **Responsive**: Mobile-friendly responsive design

## URL State Management (nuqs)

Nuqs provides type-safe URL state management, perfect for maintaining table filters, pagination, and search parameters.

### Key Files

- [`src/lib/searchparams.ts`](src/lib/searchparams.ts) - Search params configuration
- Throughout components using `useQueryState`

### Features

#### 1. Type-Safe Parsers

```typescript
// src/lib/searchparams.ts
import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString, // Search query
  category: parseAsString, // Filter by category
  status: parseAsString // Filter by status
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
```

#### 2. Server-Side Parsing

```tsx
// app/users/page.tsx
import { searchParamsCache } from '@/lib/searchparams';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  // Type-safe parsing with defaults
  const { page, limit, q, category } = searchParamsCache.parse(searchParams);

  console.log(page); // number (default: 1)
  console.log(limit); // number (default: 10)
  console.log(q); // string | null
  console.log(category); // string | null

  // Use in API calls
  const users = await fetchUsers({ page, limit, search: q, category });

  return <UsersTable users={users} />;
}
```

### Usage Examples

#### 1. Basic URL State

```tsx
'use client';

import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';

export function SearchableList() {
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />

      <div>Current page: {page}</div>
      <button onClick={() => setPage(page + 1)}>Next Page</button>
    </div>
  );
}
```

#### 2. Table State Management

```tsx
'use client';

import { useQueryState, parseAsInteger } from 'nuqs';

export function DataTable() {
  // Pagination state in URL
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        shallow: false, // Trigger navigation
        history: 'push' // Add to browser history
      })
      .withDefault(1)
  );

  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger.withDefault(10)
  );

  // Sorting state
  const [sortBy, setSortBy] = useQueryState('sort', parseAsString);
  const [sortOrder, setSortOrder] = useQueryState('order', parseAsString);

  // Filtering state
  const [status, setStatus] = useQueryState('status', parseAsString);
  const [department, setDepartment] = useQueryState('dept', parseAsString);

  return (
    <div>
      {/* Filters update URL automatically */}
      <select
        value={status || ''}
        onChange={(e) => setStatus(e.target.value || null)}
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* Table with URL-persisted state */}
      <MyTable
        page={currentPage}
        pageSize={pageSize}
        sortBy={sortBy}
        sortOrder={sortOrder}
        statusFilter={status}
        departmentFilter={department}
        onPageChange={setCurrentPage}
        onSortChange={(field, direction) => {
          setSortBy(field);
          setSortOrder(direction);
        }}
      />
    </div>
  );
}
```

#### 3. Advanced Options

```tsx
'use client';

export function AdvancedExample() {
  // Debounced search
  const [search, setSearch] = useQueryState(
    'q',
    parseAsString.withOptions({
      debounce: 300, // Debounce updates
      shallow: false, // Trigger re-render
      history: 'push', // Browser history
      clearOnDefault: true // Remove from URL when default
    })
  );

  // Multiple filters as array
  const [tags, setTags] = useQueryState('tags', parseAsArrayOf(parseAsString));

  // Custom parser
  const [dateRange, setDateRange] = useQueryState('range', {
    parse: (value: string) => {
      const [start, end] = value.split(',');
      return { start: new Date(start), end: new Date(end) };
    },
    serialize: (value: { start: Date; end: Date }) =>
      `${value.start.toISOString()},${value.end.toISOString()}`
  });

  return <div>Advanced URL state management</div>;
}
```

#### 4. Form State Persistence

```tsx
'use client';

export function PersistentForm() {
  // Form values persist in URL
  const [name, setName] = useQueryState('name', parseAsString.withDefault(''));
  const [email, setEmail] = useQueryState(
    'email',
    parseAsString.withDefault('')
  );
  const [age, setAge] = useQueryState('age', parseAsInteger.withDefault(18));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ name, email, age });

    // Optionally clear URL after submit
    setName(null);
    setEmail(null);
    setAge(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value))}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Integration with Data Tables

The template automatically integrates nuqs with TanStack Table for full URL state management:

```tsx
// All table state is automatically synced to URL
// - Current page (?page=2)
// - Page size (?limit=50)
// - Search query (?q=john)
// - Column filters (?status=active&dept=engineering)
// - Sort state (?sort=name&order=asc)

export function UsersTable() {
  return (
    <DataTable
      columns={columns}
      data={data}
      totalItems={totalCount}
      // State automatically managed via URL
    />
  );
}
```

### Benefits

1. **Shareable URLs**: Users can share filtered/sorted table states
2. **Browser Navigation**: Back/forward works with table state
3. **Type Safety**: Compile-time type checking for URL parameters
4. **Server Rendering**: URL state available during SSR
5. **Default Values**: Automatic fallbacks for missing parameters

## Forms & Components

Comprehensive form system with reusable components and validation.

### Key Features

1. **Type-Safe Forms**: React Hook Form + Zod integration
2. **Reusable Components**: Consistent form components
3. **Built-in Validation**: Client and server-side validation
4. **File Uploads**: Drag & drop file uploading
5. **Advanced Controls**: Date pickers, sliders, multi-select

### Form Components

#### Available Components

- `FormInput` - Text, email, password, number inputs
- `FormTextarea` - Multi-line text with character counts
- `FormSelect` - Dropdown select with search
- `FormCheckbox` - Single checkbox
- `FormCheckboxGroup` - Multiple checkboxes with badges
- `FormRadioGroup` - Radio button groups
- `FormSwitch` - Toggle switches
- `FormSlider` - Range sliders with value display
- `FormDatePicker` - Date selection with calendar
- `FormFileUpload` - File upload with drag & drop

### Usage Examples

#### 1. Complete Form Example

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be 18 or older'),
  country: z.string().min(1, 'Please select a country'),
  newsletter: z.boolean()
});

type UserFormData = z.infer<typeof userSchema>;

export function UserForm() {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 18,
      country: '',
      newsletter: false
    }
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const result = await createUser(data);
      if (result.success) {
        form.reset();
        toast.success('User created successfully');
      }
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <FormInput
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          required
        />

        <FormInput
          control={form.control}
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          required
        />

        <FormInput
          control={form.control}
          name="age"
          type="number"
          label="Age"
          min={18}
          max={100}
          required
        />

        <FormSelect
          control={form.control}
          name="country"
          label="Country"
          placeholder="Select your country"
          options={countryOptions}
          required
        />

        <FormSwitch
          control={form.control}
          name="newsletter"
          label="Subscribe to Newsletter"
          description="Receive updates about new features"
        />

        <Button type="submit">Create User</Button>
      </div>
    </Form>
  );
}
```

#### 2. Advanced Form Controls

```tsx
export function AdvancedForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
      {/* Multi-select checkboxes */}
      <FormCheckboxGroup
        control={form.control}
        name="interests"
        label="Interests"
        description="Select all that apply"
        options={interestOptions}
        columns={3}
        showBadges={true}
        required
      />

      {/* Range slider */}
      <FormSlider
        control={form.control}
        name="rating"
        label="Overall Rating"
        description="Rate your experience (0-10)"
        config={{
          min: 0,
          max: 10,
          step: 0.5,
          formatValue: (value) => `${value}/10`
        }}
        showValue={true}
      />

      {/* Date picker */}
      <FormDatePicker
        control={form.control}
        name="birthDate"
        label="Birth Date"
        config={{
          maxDate: new Date(),
          placeholder: 'Select your birth date'
        }}
      />

      {/* File upload */}
      <FormFileUpload
        control={form.control}
        name="avatar"
        label="Profile Picture"
        config={{
          maxSize: 5000000, // 5MB
          acceptedTypes: ['image/jpeg', 'image/png'],
          multiple: false,
          maxFiles: 1
        }}
      />
    </Form>
  );
}
```

#### 3. Custom Form Components

```tsx
// Creating a custom reusable form component
interface FormColorPickerProps<T extends FieldValues, K extends FieldPath<T>>
  extends BaseFormFieldProps<T, K> {
  colors: string[];
}

export function FormColorPicker<T extends FieldValues, K extends FieldPath<T>>({
  control,
  name,
  label,
  colors,
  required
}: FormColorPickerProps<T, K>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 w-8 rounded border-2 ${
                    field.value === color ? 'border-black' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => field.onChange(color)}
                />
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

### Multi-Step Forms

The template includes a hook for multi-step forms:

```tsx
import useMultistepForm from '@/hooks/use-multistep-form';

export function MultiStepExample() {
  const steps = [
    <PersonalInfo key="personal" />,
    <ContactInfo key="contact" />,
    <Preferences key="preferences" />,
    <Review key="review" />
  ];

  const { currentStepIndex, step, isFirstStep, isLastStep, next, back, goTo } =
    useMultistepForm(steps);

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-8 flex">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`mx-1 h-2 flex-1 rounded ${
              index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      {step}

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        {!isFirstStep && (
          <Button type="button" variant="outline" onClick={back}>
            Previous
          </Button>
        )}

        {!isLastStep ? (
          <Button type="button" onClick={next} className="ml-auto">
            Next
          </Button>
        ) : (
          <Button type="submit" className="ml-auto">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
```

### Form Validation

#### Schema-based Validation

```typescript
import * as z from 'zod';

const userSchema = z
  .object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });
```

#### Server-side Validation

```typescript
'use server';

export async function createUser(formData: FormData) {
  // Server-side validation
  const result = userSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      error: true,
      message: 'Validation failed',
      errors: result.error.format()
    };
  }

  // Process valid data
  const userData = result.data;
  // ... create user
}
```

## Project Structure

```
src/
├── actions/              # Server actions
│   ├── instance.ts       # Auth headers helper
│   └── common/          # Shared actions
├── app/                 # App router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Login page
│   ├── dashboard/       # Protected routes
│   └── api/auth/        # Auth API routes
├── components/          # React components
│   ├── ui/              # Base UI components
│   ├── forms/           # Form components
│   ├── auth/            # Auth components
│   ├── layout/          # Layout components
│   └── modal/           # Modal components
├── config/              # Configuration files
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── types/               # TypeScript types
└── constants/           # App constants
```

### Key Directories

- **`actions/`** - Server actions for data mutations
- **`components/ui/`** - Shadcn UI components
- **`components/forms/`** - Reusable form components
- **`hooks/`** - Custom hooks (data table, forms, etc.)
- **`lib/`** - Utilities (searchparams, formatting, etc.)
- **`types/`** - TypeScript type definitions
- **`config/`** - App configuration (navigation, etc.)

## Deployment

### Environment Variables

```bash
# Authentication
AUTH_SECRET=your-super-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-domain.com

# API Endpoints
AUTH_SERVICE=https://your-auth-api.com/api
COMMON_SERVICE=https://your-common-api.com/api

# Optional: Sentry (if enabled)
SENTRY_DSN=your-sentry-dsn
```

### Build and Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Or deploy to Vercel
npx vercel

# Or deploy to other platforms
# Make sure to set environment variables
```

### Performance Considerations

1. **Bundle Size**: Tree-shake unused components
2. **Images**: Use Next.js Image component for optimization
3. **Caching**: Implement proper cache strategies
4. **Database**: Optimize queries and add indexes
5. **CDN**: Use CDN for static assets

### Monitoring

The template includes Sentry integration for error tracking:

```typescript
// Import Sentry instrumentation (if needed)
import './src/lib/sentry';
```

Configure in your deployment environment with proper DSN and settings.

---

## Summary

This Next.js starter template provides:

✅ **Authentication** - NextAuth.js v5 with JWT, token refresh, and "Remember Me"  
✅ **RBAC** - Role-based access control for navigation and pages  
✅ **PPR Ready** - Configured for Partial Prerendering (Next.js 16)  
✅ **Server Actions** - Type-safe server-side mutations with cache revalidation  
✅ **TanStack Table** - Advanced data tables with server-side operations  
✅ **URL State** - Type-safe URL state management with nuqs  
✅ **Forms** - Comprehensive form system with validation  
✅ **UI Components** - Full Shadcn UI component library  
✅ **TypeScript** - End-to-end type safety  
✅ **Performance** - Optimized for production use

The template is production-ready and can be customized for various use cases including admin panels, dashboards, and SaaS applications.
