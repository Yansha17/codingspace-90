
export interface LibraryItem {
  id: string;
  title: string;
  language: string;
  code: string;
  category: string;
  tags: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LibraryCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const DEFAULT_CATEGORIES: LibraryCategory[] = [
  { id: 'web', name: 'Web Development', color: '#3B82F6', icon: '🌐' },
  { id: 'mobile', name: 'Mobile Apps', color: '#10B981', icon: '📱' },
  { id: 'algorithms', name: 'Algorithms', color: '#8B5CF6', icon: '⚡' },
  { id: 'ui', name: 'UI Components', color: '#F59E0B', icon: '🎨' },
  { id: 'data', name: 'Data Science', color: '#EF4444', icon: '📊' },
  { id: 'snippets', name: 'Code Snippets', color: '#6B7280', icon: '📄' }
];
