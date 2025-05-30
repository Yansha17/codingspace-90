
import { useState, useEffect } from 'react';
import { LibraryItem, LibraryCategory, DEFAULT_CATEGORIES } from '@/types/Library';

const LIBRARY_STORAGE_KEY = 'coding-playground-library';
const CATEGORIES_STORAGE_KEY = 'coding-playground-categories';

export const useLibrary = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [categories, setCategories] = useState<LibraryCategory[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    loadLibrary();
    loadCategories();
  }, []);

  const loadLibrary = () => {
    try {
      const saved = localStorage.getItem(LIBRARY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        })));
      }
    } catch (error) {
      console.error('Failed to load library:', error);
    }
  };

  const loadCategories = () => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        setCategories(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const saveLibrary = (newItems: LibraryItem[]) => {
    try {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error('Failed to save library:', error);
    }
  };

  const saveCategories = (newCategories: LibraryCategory[]) => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Failed to save categories:', error);
    }
  };

  const addItem = (item: Omit<LibraryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: LibraryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newItems = [...items, newItem];
    saveLibrary(newItems);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<LibraryItem>) => {
    const newItems = items.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    );
    saveLibrary(newItems);
  };

  const deleteItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    saveLibrary(newItems);
  };

  const searchItems = (query: string) => {
    return items.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.code.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getItemsByCategory = (categoryId: string) => {
    return items.filter(item => item.category === categoryId);
  };

  return {
    items,
    categories,
    addItem,
    updateItem,
    deleteItem,
    searchItems,
    getItemsByCategory,
    saveCategories
  };
};
