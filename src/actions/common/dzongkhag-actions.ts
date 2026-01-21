'use server';

import { updateTag } from 'next/cache';
import { instance } from '../instance';
import { ApiErrorResponse } from '@/types/api-error-reponse';

const API_URL = process.env.COMMON_SERVICE;

export async function createDzongkhags(formData: any) {
  try {
    const response = await fetch(`${API_URL}/dzongkhags`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: await instance()
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as ApiErrorResponse)?.message ||
        'Failed to add dzongkhags';
      return { error: true, message: errorMessage };
    }

    updateTag('dzongkhags');
    return data;
  } catch (error) {
    console.error('Error creating dzongkhag:', error);
    return { error: true, message: 'Failed to add dzongkhags' };
  }
}

export async function getDzongkhags({
  page,
  limit,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  let url = `${API_URL}/dzongkhags?page=${page}&take=${limit}`;
  try {
    // Search
    if (search) {
      url += `&q=${search}`;
    }

    const response = await fetch(url, {
      headers: await instance(),
      next: { tags: ['dzongkhags'] }
    });

    if (!response.ok) {
      return {
        page: 0,
        limit: 0,
        totalDzongkhags: 0,
        dzongkhags: []
      };
    }

    const data = await response.json();

    const dzongkhags = data.data || [];
    const meta = data.meta || { page: 0, take: 0, itemCount: 0 };

    return {
      page: meta.page,
      limit: meta.take,
      totalDzongkhags: meta.itemCount,
      dzongkhags
    };
  } catch (error) {
    console.error('Error fetching dzongkhags:', error);
    return {
      page: 0,
      limit: 0,
      totalDzongkhags: 0,
      dzongkhags: []
    };
  }
}

export async function getAllDzongkhags() {
  try {
    const response = await fetch(`${API_URL}/dzongkhags/all`, {
      headers: await instance(),
      next: { tags: ['dzongkhags'] }
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to fetch dzongkhags: ${response.statusText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching dzongkhags:', error);
  }
}

export async function deleteDzongkhag(id?: string) {
  try {
    const response = await fetch(`${API_URL}/dzongkhags/${id}`, {
      method: 'DELETE',
      headers: await instance()
    });

    if (!response.ok) {
      return {
        error: true,
        message: `Failed to delete dzongkhag: ${response.statusText}`
      };
    }

    updateTag('dzongkhags');
  } catch (error) {
    console.error('Error deleting dzongkhag:', error);
    return null;
  }
}

export async function updateDzongkhag(id: string, data: any) {
  const response = await fetch(`${API_URL}/dzongkhags/${id}`, {
    method: 'PATCH',
    headers: await instance(),
    body: JSON.stringify(data)
  });

  const res = await response.json();

  if (!response.ok || res?.error) {
    const errorMessage =
      (res?.error as ApiErrorResponse)?.message || 'Failed to update dzongkhag';
    return { error: true, message: errorMessage };
  }

  updateTag('dzongkhags');
  return res;
}
