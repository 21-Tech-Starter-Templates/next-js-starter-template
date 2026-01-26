<p align="center">
<h1 align="center">Dashboard Starter Template with Next.js &amp; Shadcn UI</h1>

<div align="center">Built with the Next.js 16 App Router, Tailwind CSS &amp; Shadcn UI components</div>

<br />

## Overview

This is an **admin dashboard starter template** built with **Next.js 16, Shadcn UI, and Tailwind CSS**.

It gives you a production-ready **dashboard UI** with authentication, charts, tables, forms, and a feature-based folder structure, perfect for **SaaS apps, internal tools, and admin panels**.

### Tech Stack

This template uses the following stack:

- **Framework** - [Next.js 16](https://nextjs.org/16) - The React framework for production with App Router, server components, and built-in optimizations
- **Language** - [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript with excellent IDE support and compile-time error catching

- **🔐 Auth** - [NextAuth.js](https://next-auth.js.org/) - Complete authentication solution with multiple providers (Google, GitHub, credentials), built-in security features, and seamless Next.js integration

- **🎨 Styling** - [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS framework with built-in design system, responsive utilities, dark mode support, and optimal performance through tree-shaking

- **🧩 Components** - [Shadcn-ui](https://ui.shadcn.com) - High-quality, accessible React components built on Radix UI primitives. Copy-pastable rather than installed dependencies, giving you full control over the code

- **✅ Schema Validations** - [Zod](https://zod.dev) - TypeScript-first schema validation with runtime type checking, type inference, and seamless integration with forms for type-safe data validation

- **🧠 State Management** - [Zustand](https://zustand-demo.pmnd.rs) - Lightweight (2.5kb), simple state management with minimal boilerplate, TypeScript support, and no providers required

- **🔍 Search Params State Manager** - [Nuqs](https://nuqs.47ng.com/) - URL-synchronized state management for shareable URLs, browser navigation support, and server-side rendering compatibility

- **📊 Tables** - [Tanstack Data Tables](https://ui.shadcn.com/docs/components/data-table) • [Dice table](https://www.diceui.com/docs/components/data-table) - Headless table logic with advanced sorting, filtering, pagination, and server-side data handling

- **📝 Forms** - [React Hook Form](https://ui.shadcn.com/docs/components/form) - Performant forms with minimal re-renders, built-in validation, and excellent TypeScript support integrated with Zod schemas

- **⌘ Command+k interface** - [kbar](https://kbar.vercel.app/) - Command palette interface for better user experience and navigation
- **🔧 Linting** - [ESLint](https://eslint.org) - Code quality and consistency enforcement
- **🪝 Pre-commit Hooks** - [Husky](https://typicode.github.io/husky/) - Git hooks for automated code quality checks
- **💅 Formatting** - [Prettier](https://prettier.io) - Consistent code formatting across the project

## Features

- 🧱 Pre-built **admin dashboard layout** (sidebar, header)

- 📋 **Data tables** with server-side search, filter & pagination

- 🔐 **Authentication**

- 🔒 **RBAC navigation system** - Fully client-side navigation filtering based on userType,permissions, and roles

- 🧩 **Shadcn UI components** with Tailwind CSS styling

- 🧠 Feature-based folder structure for scalable projects
  |

## Getting Started

> [!NOTE]  
> This admin dashboard starter uses **Next.js 16 (App Router)** with **React 19** and **Shadcn UI**. Follow these steps to run it locally:

Clone the repo:

```
git clone https://github.com/21-Tech-Starter-Templates/next-js-starter-template.git
OR
Get inside your project directory
ex. cd your project
npx degit https://github.com/21-Tech-Starter-Templates/next-js-starter-template.git ./ --force
```

- `pnpm install`
- Create a `.env.local` file by copying the example environment file:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file.
- `pnpm run dev`

##### Environment Configuration Setup

To configure the environment for this project, refer to the `env.example.txt` file. This file contains the necessary environment variables required for authentication and error tracking.

> [!WARNING]
> After cloning or forking the repository, be cautious when pulling or syncing with the latest changes, as this may result in breaking conflicts.

Cheers! 🥂
