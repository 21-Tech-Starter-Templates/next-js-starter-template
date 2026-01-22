# Next.js Dashboard Starter Template - Complete Guide & Usage

This is a comprehensive Next.js dashboard starter template designed for building enterprise-grade web applications with modern architecture patterns, role-based access control, and production-ready features.

## 🎯 **What This Template Solves & Why Use It**

### **Problem Statement**

Building modern web applications from scratch involves:

- Setting up complex authentication flows
- Implementing role-based access control
- Creating consistent UI components
- Managing form validations
- Building responsive layouts
- Setting up development workflows
- Configuring performance optimizations

### **Our Solution**

This template provides a **battle-tested foundation** that eliminates months of initial setup work:

✅ **Enterprise Authentication** - JWT-based auth with session management  
✅ **RBAC System** - Granular permissions and role management  
✅ **50+ UI Components** - Pre-built, accessible, and customizable  
✅ **Type Safety** - End-to-end TypeScript with strict configuration  
✅ **Performance Optimized** - Code splitting, caching, and best practices  
✅ **Developer Experience** - Hot reload, linting, formatting, and debugging tools

## 🏗️ **Architecture & Design Philosophy**

### **Why This Tech Stack?**

#### **Next.js 16 App Router**

**Why:** Server-side rendering, API routes, and file-based routing

```typescript
// Benefits:
- SEO optimization out of the box
- Automatic code splitting
- Built-in performance optimizations
- Server and client components
- Streaming and progressive enhancement
```

#### **TypeScript with Strict Mode**

**Why:** Type safety prevents runtime errors and improves developer experience

```typescript
// Example: Type-safe API responses
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Compile-time error prevention
const handleUserData = (user: User) => {
  // TypeScript ensures 'user' has required properties
  return user.email.toLowerCase(); // ✅ Safe
};
```

#### **NextAuth.js v5 + RBAC**

**Why:** Secure, flexible authentication with enterprise-grade features

```typescript
// Benefits:
- Multiple provider support (OAuth, credentials, etc.)
- JWT token management with refresh
- Session persistence and security
- Role-based access control
- Integration with external APIs
```

#### **ShadCN/UI + Radix Primitives**

**Why:** Accessible, customizable components without vendor lock-in

```typescript
// Advantages:
- Copy-paste components (you own the code)
- Built on Radix UI (accessibility by default)
- Consistent design system
- Easy customization with Tailwind
- No bundle size bloat
```

#### **TanStack Table + React Hook Form**

**Why:** Powerful data handling with minimal boilerplate

```typescript
// Complex data operations made simple:
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel()
  // Automatic sorting, filtering, pagination
});
```

## 🚀 **How to Use This Template**

### **1. Understanding the Structure**

```
src/
├── app/                    # Next.js App Router (Pages & API)
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Protected dashboard area
│   └── api/               # API endpoints
├── components/            # Reusable UI components
│   ├── ui/               # Base ShadCN components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── types/                # TypeScript definitions
└── config/               # App configuration
```

### **2. Key Concepts & Usage Patterns**

#### **Authentication Flow**

```typescript
// How it works:
1. User logs in → NextAuth creates JWT token
2. Token contains user info + roles + abilities
3. Navigation filters based on permissions
4. Server actions validate permissions
5. Auto token refresh handles expiration
```

#### **RBAC Implementation**

```typescript
// Permission checking:
const { hasAbility } = useUserAbilities();

// Component-level access control
if (!hasAbility('manage:users')) {
  return <AccessDenied />;
}

// Navigation filtering (automatic)
const filteredNav = useFilteredNavItems(navItems);
// Only shows items user can access
```

#### **Form System**

```typescript
// Type-safe forms with validation:
const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email')
});

const form = useForm({
  resolver: zodResolver(schema)
});

// Automatic validation + error handling
```

## 🔧 **Adding New Features: Step-by-Step Guide**

### **Scenario 1: Adding a "Products" Management Feature**

#### **Step 1: Create the Page Structure**

```bash
mkdir -p src/app/dashboard/products
touch src/app/dashboard/products/page.tsx
touch src/app/dashboard/products/loading.tsx
mkdir -p src/app/dashboard/products/_components
```

#### **Step 2: Define Types**

```typescript
// src/types/product.ts
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
}
```

#### **Step 3: Add Navigation**

```typescript
// src/config/nav-config.ts
{
  title: 'Products',
  url: '/dashboard/products',
  icon: 'package',
  isActive: false,
  items: [
    {
      title: 'Product List',
      url: '/dashboard/products',
      access: {
        permission: 'read:products'
      }
    },
    {
      title: 'Add Product',
      url: '/dashboard/products/create',
      access: {
        permission: 'create:products'
      }
    }
  ],
  access: {
    permission: 'read:products'
  }
}
```

#### **Step 4: Create the Main Page**

```typescript
// src/app/dashboard/products/page.tsx
import { Suspense } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductsTable } from './_components/products-table';
import { ProductsLoading } from './_components/products-loading';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Products', link: '/dashboard/products' }
];

export default function ProductsPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <CreateProductButton />
        </div>

        <Suspense fallback={<ProductsLoading />}>
          <ProductsTable />
        </Suspense>
      </div>
    </PageContainer>
  );
}
```

#### **Step 5: Create Server Actions**

```typescript
// src/actions/products-actions.ts
'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required')
});

export async function createProduct(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  // Check permissions
  if (!hasPermission(session.user, 'create:products')) {
    throw new Error('Insufficient permissions');
  }

  const validatedData = createProductSchema.parse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
    category: formData.get('category')
  });

  // Call your API or database
  const result = await api.products.create(validatedData);

  revalidatePath('/dashboard/products');
  return result;
}
```

#### **Step 6: Create Data Table Component**

```typescript
// src/app/dashboard/products/_components/products-table.tsx
'use client';

import { useUserAbilities } from '@/hooks/use-nav';
import { DataTable } from '@/components/ui/data-table';
import { productColumns } from './product-columns';

export function ProductsTable() {
  const { hasAbility } = useUserAbilities();
  const canEdit = hasAbility('update:products');
  const canDelete = hasAbility('delete:products');

  return (
    <DataTable
      data={products}
      columns={productColumns({ canEdit, canDelete })}
      searchKey="name"
      filterableColumns={[
        {
          id: 'category',
          title: 'Category',
          options: categoryOptions
        },
        {
          id: 'status',
          title: 'Status',
          options: statusOptions
        }
      ]}
    />
  );
}
```

### **Scenario 2: Adding a Dashboard Widget**

#### **Step 1: Create Widget Component**

```typescript
// src/app/dashboard/overview/_components/sales-widget.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface SalesWidgetProps {
  data: {
    total: number;
    growth: number;
    period: string;
  };
}

export function SalesWidget({ data }: SalesWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${data.total.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          +{data.growth}% from last {data.period}
        </p>
      </CardContent>
    </Card>
  );
}
```

#### **Step 2: Add to Dashboard**

```typescript
// src/app/dashboard/overview/page.tsx
import { SalesWidget } from './_components/sales-widget';
import { getSalesData } from '@/actions/analytics-actions';

export default async function OverviewPage() {
  const salesData = await getSalesData();

  return (
    <PageContainer>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SalesWidget data={salesData} />
          {/* More widgets */}
        </div>
      </div>
    </PageContainer>
  );
}
```

## 🎨 **UI Component Usage Patterns**

### **Form Components**

```typescript
// Using pre-built form components:
<Form {...form}>
  <div className="grid gap-4 md:grid-cols-2">
    <FormInput
      control={form.control}
      name="firstName"
      label="First Name"
      placeholder="Enter first name"
      required
    />

    <FormSelect
      control={form.control}
      name="category"
      label="Category"
      options={categoryOptions}
      placeholder="Select category"
    />

    <FormDatePicker
      control={form.control}
      name="startDate"
      label="Start Date"
      required
    />
  </div>
</Form>
```

### **Data Tables**

```typescript
// Advanced table features:
<DataTable
  data={data}
  columns={columns}
  searchKey="name"
  pageNo={pageNo}
  totalItems={totalItems}
  pageSizeOptions={[10, 20, 30, 50]}
  searchableColumns={[
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' }
  ]}
  filterableColumns={[
    {
      id: 'status',
      title: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }
  ]}
/>
```

## 🔒 **Security & Permissions**

### **Page-Level Protection**

```typescript
// Protect entire pages:
export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  if (!hasRole(session.user, 'admin')) {
    return <UnauthorizedPage />;
  }

  return <AdminDashboard />;
}
```

### **Component-Level Protection**

```typescript
// Conditional rendering based on permissions:
function UserActions({ user }: { user: User }) {
  const { hasAbility } = useUserAbilities();

  return (
    <div className="flex gap-2">
      {hasAbility('read:users') && (
        <Button variant="outline">View</Button>
      )}

      {hasAbility('update:users') && (
        <Button variant="default">Edit</Button>
      )}

      {hasAbility('delete:users') && (
        <Button variant="destructive">Delete</Button>
      )}
    </div>
  );
}
```

## 📱 **Responsive Design Patterns**

### **Mobile-First Approach**

```typescript
// Responsive layouts:
<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Responsive grid */}
</div>

// Conditional rendering for mobile:
<div className="hidden md:block">
  <DesktopComponent />
</div>
<div className="block md:hidden">
  <MobileComponent />
</div>
```

### **Sidebar Behavior**

```typescript
// Automatic sidebar collapse on mobile:
<Sidebar collapsible="icon"> {/* Collapses to icons on small screens */}
  <SidebarContent>
    <Navigation items={filteredNavItems} />
  </SidebarContent>
</Sidebar>
```

## 🎛️ **Customization & Theming**

### **Adding Custom Themes**

```css
/* src/app/theme.css */
[data-theme='corporate'] {
  --primary: 203 89% 53%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 95%;
  /* Custom color scheme */
}
```

### **Component Variants**

```typescript
// Extending existing components:
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        success: 'bg-green-600 text-white hover:bg-green-700' // Custom variant
      }
    }
  }
);
```

## 🚀 **Performance Optimization Strategies**

### **Code Splitting**

```typescript
// Lazy load heavy components:
const ChartComponent = dynamic(() => import('./ChartComponent'), {
  loading: () => <ChartSkeleton />,
  ssr: false // Client-side only if needed
});
```

### **Image Optimization**

```typescript
// Next.js Image component:
<Image
  src="/product-image.jpg"
  alt="Product"
  width={300}
  height={200}
  priority={isAboveFold}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## 🧪 **Testing Strategies**

### **Component Testing**

```typescript
// Testing form components:
import { render, screen, userEvent } from '@/test-utils';

test('form submission with validation', async () => {
  render(<CreateProductForm />);

  const user = userEvent.setup();

  await user.type(screen.getByLabelText(/name/i), 'Test Product');
  await user.type(screen.getByLabelText(/price/i), '99.99');
  await user.click(screen.getByRole('button', { name: /create/i }));

  expect(screen.getByText('Product created successfully')).toBeInTheDocument();
});
```

## 📈 **Monitoring & Analytics**

### **Error Tracking**

```typescript
// Custom error boundary:
'use client';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Something went wrong!</h2>
            <button onClick={reset}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

## 🔄 **Development Workflow**

### **Adding Features Checklist**

1. ✅ Create types in `/types` directory
2. ✅ Add navigation in `/config/nav-config.ts`
3. ✅ Create page in `/app/dashboard/feature`
4. ✅ Build server actions in `/actions`
5. ✅ Create components in `_components` directory
6. ✅ Add permission checks for RBAC
7. ✅ Test responsive design
8. ✅ Add error handling and loading states
9. ✅ Update documentation

### **Code Quality Standards**

```typescript
// Always use TypeScript interfaces:
interface ComponentProps {
  data: Product[];
  onEdit?: (product: Product) => void;
  className?: string;
}

// Use proper error handling:
try {
  const result = await createProduct(data);
  toast.success('Product created successfully');
} catch (error) {
  toast.error('Failed to create product');
  Sentry.captureException(error);
}

// Follow naming conventions:
- Components: PascalCase (ProductCard)
- Files: kebab-case (product-card.tsx)
- Functions: camelCase (createProduct)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)
```

This template accelerates development by providing proven patterns and eliminating common setup tasks, allowing you to focus on business logic rather than boilerplate code.

# Clone the repository

git clone <repository-url> my-dashboard-app
cd my-dashboard-app

# Install dependencies

pnpm install

# Copy environment variables

cp .env.example.txt .env.local

# Start development server

pnpm dev

````

### Environment Variables

Create a `.env.local` file with these required variables:

```env
# Authentication
AUTH_SECRET="your-auth-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
AUTH_SERVICE="http://localhost:8000/api/v1"

# Optional: Database URLs, External APIs, etc.
DATABASE_URL="your-database-url"
````

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

- Server-side caching with `revalidatePath,updateTag`
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

## 📋 **Code Conventions & Patterns**

### Import Order Guidelines

```tsx
// 1. React and Next.js imports
import React from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';

// 2. External libraries (alphabetical)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 3. UI components (alphabetical)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

// 4. Custom components (alphabetical)
import { FormInput } from '@/components/forms/form-input';
import { PageContainer } from '@/components/layout/page-container';

// 5. Hooks and utilities
import { useUserAbilities } from '@/hooks/use-nav';
import { cn } from '@/lib/utils';

// 6. Configuration and constants
import { navItems } from '@/config/nav-config';

// 7. Types (always last)
import type { User, NavItem } from '@/types';
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

## 🎛️ **Advanced Configuration**

### Environment Variables

**Development (.env.local):**

```env
# Authentication
AUTH_SECRET="dev-secret-change-in-production"
NEXTAUTH_SECRET="nextauth-secret-key"
AUTH_SERVICE="http://localhost:8000/api/v1"

# Database (optional)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Redis Session Store (optional)
REDIS_URL="redis://localhost:6379"

# External APIs
EXTERNAL_API_KEY="your-api-key"

# Feature Flags
ENABLE_ANALYTICS="true"
ENABLE_NOTIFICATIONS="false"
```

**Production Environment:**

```env
# Use strong secrets in production
AUTH_SECRET="your-super-secure-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
AUTH_SERVICE="https://api.yourdomain.com/v1"

# Production database
DATABASE_URL="postgresql://prod-user:password@prod-host:5432/prod-db"

# Redis cluster
REDIS_URL="redis://prod-redis:6379"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

### Next.js Configuration

**next.config.ts:**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },

  // Image optimization
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/webp', 'image/avif']
  },

  // API routes
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.AUTH_SERVICE}/:path*`
      }
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
```

### Tailwind Configuration

**tailwind.config.js:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        }
        // ... more color definitions
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
```

### TypeScript Configuration

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🤝 **Contributing Guidelines**

### Development Workflow

1. **Fork and Clone:**

```bash
git clone <your-fork-url>
cd next-js-starter-template
pnpm install
```

2. **Create Feature Branch:**

```bash
git checkout -b feature/your-feature-name
```

3. **Development:**

```bash
# Start development server
pnpm dev

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run formatting
pnpm format
```

4. **Commit Guidelines:**

```bash
# Use conventional commits
git commit -m "feat: add new navigation component"
git commit -m "fix: resolve authentication issue"
git commit -m "docs: update README with deployment guide"
```

### Code Review Checklist

- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Components follow established patterns
- [ ] Proper error handling implemented
- [ ] Loading states added where needed
- [ ] Accessibility considerations
- [ ] Mobile responsiveness verified
- [ ] Performance impact considered

### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested with screen reader
- [ ] Verified in both light and dark themes

## Screenshots

If applicable, add screenshots to help explain your changes.

## Additional Notes

Any additional information or context.
```

## 📚 **API Reference**

### Authentication Hooks

```typescript
// useSession - Get current user session
const { data: session, status } = useSession();

// useUserAbilities - Check user permissions
const { hasAbility, hasAnyAbility, abilities } = useUserAbilities();

// useUserRoles - Check user roles
const { hasRole, hasAnyRole, roles } = useUserRoles();

// useFilteredNavItems - Filter navigation by permissions
const filteredItems = useFilteredNavItems(navItems);
```

### Utility Functions

```typescript
// cn - Tailwind class name utility
import { cn } from '@/lib/utils';
const className = cn('base-class', condition && 'conditional-class');

// formatters - Data formatting utilities
import { formatCurrency, formatDate } from '@/lib/format';
const price = formatCurrency(99.99);
const date = formatDate(new Date());

// parsers - Data parsing utilities
import { parseSearchParams } from '@/lib/searchparams';
const params = parseSearchParams(searchParams);
```

### Component APIs

```typescript
// Button variants
<Button variant="default | destructive | outline | secondary | ghost | link">
  Click me
</Button>

// Input with validation
<FormInput
  control={form.control}
  name="email"
  label="Email Address"
  type="email"
  required
  description="We'll never share your email."
/>

// Data table with actions
<DataTable
  data={data}
  columns={columns}
  searchKey="name"
  pageNo={pageNo}
  totalUsers={totalUsers}
  pageSizeOptions={[10, 20, 30, 40, 50]}
  searchableColumns={[
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' }
  ]}
  filterableColumns={[
    { id: 'status', title: 'Status', options: statusOptions }
  ]}
/>
```

## 🔧 **Troubleshooting**

### Common Issues

**Authentication not working:**

```bash
# Check environment variables
echo $AUTH_SECRET
echo $AUTH_SERVICE

# Verify API endpoint is accessible
curl $AUTH_SERVICE/auth/login

# Check Next.js logs
tail -f .next/server.js
```

**Navigation not filtering:**

```typescript
// Debug user abilities
console.log('User abilities:', session?.user?.ability);

// Check navigation configuration
console.log('Nav items:', navItems);

// Verify RBAC hook
const { hasAbility } = useUserAbilities();
console.log('Has manage:all?', hasAbility('manage:all'));
```

**Build errors:**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Type check
pnpm type-check
```

**Performance issues:**

```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Dynamic imports for heavy libraries
const Chart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />
});
```

### Getting Help

- **Documentation:** Check this file and inline comments
- **Issues:** Create GitHub issues with detailed information
- **Discord/Slack:** Join community channels for real-time help
- **Stack Overflow:** Tag questions with relevant technologies

## 🚀 **Production Deployment Checklist**

### Pre-deployment

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] CDN configured for static assets
- [ ] Monitoring tools setup
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Security headers configured

### Deployment Process

1. **Build Verification:**

```bash
pnpm build
pnpm start # Test production build locally
```

2. **Environment Setup:**

```env
NODE_ENV=production
AUTH_SECRET="production-secret-256-bit"
NEXTAUTH_URL="https://yourdomain.com"
```

3. **Deploy to Platform:**

```bash
# Vercel
vercel --prod

# AWS Amplify
amplify deploy

# Docker
docker build -t my-app .
docker run -p 3000:3000 my-app
```

### Post-deployment

- [ ] Smoke test critical paths
- [ ] Verify authentication flow
- [ ] Check error tracking
- [ ] Monitor performance metrics
- [ ] Test mobile responsiveness
- [ ] Validate SEO metadata

## 📈 **Scaling Considerations**

### Performance Optimization

**Database:**

- Connection pooling
- Query optimization
- Caching strategies
- Read replicas

**Frontend:**

- Code splitting
- Image optimization
- Bundle analysis
- Service workers

**Infrastructure:**

- CDN setup
- Load balancing
- Auto-scaling
- Monitoring

### Architecture Evolution

**Microservices:**

```typescript
// API route organization
/api/
├── auth/          # Authentication service
├── users/         # User management
├── notifications/ # Notification service
└── analytics/     # Analytics service
```

**State Management:**

```typescript
// Zustand store for complex state
interface AppState {
  user: User | null;
  notifications: Notification[];
  theme: 'light' | 'dark';
  setUser: (user: User) => void;
  addNotification: (notification: Notification) => void;
}
```

This documentation provides a comprehensive guide to understanding, developing with, and extending the Next.js Dashboard Starter Template. For specific implementation details, refer to the inline code documentation and component examples throughout the codebase.

---
