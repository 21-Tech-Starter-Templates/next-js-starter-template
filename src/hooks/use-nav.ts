'use client';

/**
 * Fully client-side hook for filtering navigation items based on RBAC
 *
 * This hook uses NextAuth's useSession hook to check permissions, roles, and organization
 * without any server calls. This is perfect for navigation visibility (UX only).
 *
 * Performance:
 * - All checks are synchronous (no server calls)
 * - Instant filtering
 * - No loading states
 * - No UI flashing
 *
 * Note: For actual security (API routes, server actions), always use server-side checks.
 * This is only for UI visibility.
 */

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import type { NavItem } from '@/types';

/**
 * Hook to filter navigation items based on RBAC (fully client-side)
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  const { data: session, status } = useSession();
  const user = session?.user;

  // Helper function to check if user has a specific ability
  const hasAbility = useMemo(() => {
    if (!user?.ability) {
      console.log('🔍 No abilities found for user');
      return () => false;
    }

    // Flatten abilities array in case it's nested: [['manage:all']] -> ['manage:all']
    const flattenedAbilities = user.ability.flat();
    console.log('🔍 Flattened abilities:', flattenedAbilities);

    return (permission: string) => {
      // Check for 'manage:all' - grants access to everything
      const hasManageAll = flattenedAbilities.some((ability) => {
        if (typeof ability === 'string') {
          return ability === 'manage:all';
        }
        return (
          ability.name === 'manage:all' ||
          `${ability.action}:${ability.subject}` === 'manage:all'
        );
      });

      if (hasManageAll) {
        console.log(
          `🔍 User has 'manage:all' - granting access to "${permission}"`
        );
        return true;
      }

      const result = flattenedAbilities.some((ability) => {
        if (typeof ability === 'string') {
          return ability === permission;
        }
        // Legacy object format: { name, action, subject }
        return (
          ability.name === permission ||
          `${ability.action}:${ability.subject}` === permission
        );
      });

      console.log(`🔍 Checking ability "${permission}":`, {
        result,
        hasManageAll,
        userAbilities: flattenedAbilities
      });

      return result;
    };
  }, [user?.ability]);

  // Helper function to check if user has a specific role
  const hasRole = useMemo(() => {
    if (!user?.roles) {
      console.log('🔍 No roles found for user');
      return () => false;
    }

    return (roleName: string) => {
      const result = user.roles.some((role) => role.name === roleName);
      console.log(`🔍 Checking role "${roleName}":`, {
        result,
        userRoles: user.roles.map((r) => r.name)
      });
      return result;
    };
  }, [user?.roles]);

  // Helper function to check if an item passes all access checks
  const checkItemAccess = useMemo(() => {
    return (access: any) => {
      if (!access) {
        console.log('🔍 No access restrictions, allowing access');
        return true;
      }

      console.log('🔍 Checking access:', access);

      // Check permission (ability)
      if (access.permission && !hasAbility(access.permission)) {
        console.log(
          `🔍 Access denied: Missing permission "${access.permission}"`
        );
        return false;
      }

      // Check role
      if (access.role && !hasRole(access.role)) {
        console.log(`🔍 Access denied: Missing role "${access.role}"`);
        return false;
      }

      console.log('🔍 Access granted');
      return true;
    };
  }, [hasAbility, hasRole]);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    // Return empty array if session is loading or no session
    if (status === 'loading' || !session) {
      console.log('🔍 Navigation Filter Debug: Session loading or no session', {
        status,
        hasSession: !!session
      });
      return [];
    }

    console.log('🔍 Navigation Filter Debug: Processing items', {
      user: session?.user,
      abilities: user?.ability,
      roles: user?.roles,
      totalItems: items.length
    });

    const filtered = items
      .filter((item) => {
        const hasAccess = checkItemAccess(item.access);
        console.log(`🔍 Item "${item.title}":`, {
          access: item.access,
          hasAccess,
          abilities: user?.ability,
          roles: user?.roles
        });
        return hasAccess;
      })
      .map((item) => {
        // Recursively filter child items
        if (item.items && item.items.length > 0) {
          const filteredChildren = item.items.filter((childItem) => {
            const childHasAccess = checkItemAccess(childItem.access);
            console.log(`🔍 Child "${childItem.title}" of "${item.title}":`, {
              access: childItem.access,
              hasAccess: childHasAccess
            });
            return childHasAccess;
          });

          return {
            ...item,
            items: filteredChildren
          };
        }

        return item;
      });

    console.log('🔍 Navigation Filter Debug: Final filtered items', {
      filteredCount: filtered.length,
      filteredItems: filtered.map((item) => ({
        title: item.title,
        hasChildren: !!item.items?.length,
        childrenCount: item.items?.length || 0
      }))
    });

    return filtered;
  }, [items, checkItemAccess, session, status, user]);

  return filteredItems;
}

/**
 * Hook to check user abilities/permissions
 */
export function useUserAbilities() {
  const { data: session } = useSession();
  const user = session?.user;

  return useMemo(() => {
    if (!user?.ability) {
      return {
        hasAbility: () => false,
        hasAnyAbility: () => false,
        hasAllAbilities: () => false,
        abilities: []
      };
    }

    // Flatten and process abilities
    const abilities = user.ability
      .flat() // Handle nested arrays: [['manage:all']] -> ['manage:all']
      .map((ability) =>
        typeof ability === 'string'
          ? ability
          : ability.name || `${ability.action}:${ability.subject}`
      );

    // Check if user has 'manage:all' permission
    const hasManageAll = abilities.includes('manage:all');

    return {
      hasAbility: (permission: string) =>
        hasManageAll || abilities.includes(permission),
      hasAnyAbility: (permissions: string[]) =>
        hasManageAll || permissions.some((p) => abilities.includes(p)),
      hasAllAbilities: (permissions: string[]) =>
        hasManageAll || permissions.every((p) => abilities.includes(p)),
      abilities
    };
  }, [user?.ability]);
}

/**
 * Hook to check user roles
 */
export function useUserRoles() {
  const { data: session } = useSession();
  const user = session?.user;

  return useMemo(() => {
    if (!user?.roles) {
      return {
        hasRole: () => false,
        hasAnyRole: () => false,
        hasAllRoles: () => false,
        roles: [],
        roleNames: []
      };
    }

    const roleNames = user.roles.map((role) => role.name);

    return {
      hasRole: (roleName: string) => roleNames.includes(roleName),
      hasAnyRole: (roles: string[]) => roles.some((r) => roleNames.includes(r)),
      hasAllRoles: (roles: string[]) =>
        roles.every((r) => roleNames.includes(r)),
      roles: user.roles,
      roleNames
    };
  }, [user?.roles]);
}
