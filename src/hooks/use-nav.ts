'use client';

import { useMemo } from 'react';
import type { NavItem } from '@/types';

/**
 * Hook to filter navigation items (authentication removed)
 *
 * Since authentication has been removed, this now returns all nav items.
 * You can add custom filtering logic here if needed.
 *
 * @param items - Array of navigation items to filter
 * @returns All nav items (no filtering)
 */
export function useFilteredNavItems(items: NavItem[]) {
  // Since auth is removed, return all items
  const filteredItems = useMemo(() => {
    return items.map((item) => {
      // If item has children, return them too
      if (item.items && item.items.length > 0) {
        return {
          ...item,
          items: item.items // Return all child items
        };
      }
      return item;
    });
  }, [items]);

  return filteredItems;
}
