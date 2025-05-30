import React, { useState } from 'react';
import { Search, Plus, Code, Folder, Tag, Calendar, Eye, Edit, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLibrary } from '@/hooks/useLibrary';
import { LibraryItem } from '@/types/Library';
import CodePreviewMini from './CodePreviewMini';

interface LibraryProps {
  onCreateFromLibrary?: (item: LibraryItem) => void;
  onClose?: () => void;
}

const Library: React.FC<LibraryProps> = ({ onCreateFromLibrary, onClose }) => {
  const { items, categories, deleteItem, searchItems, getItemsByCategory } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? (searchQuery ? searchItems(searchQuery) : items)
    : getItemsByCategory(selectedCategory).filter(item => 
        !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleUseCode = (item: LibraryItem) => {
    onCreateFromLibrary?.(item);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with X button */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Code Library</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{items.length} items</span>
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search code snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Code className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No code snippets found</h3>
            <p className="text-sm text-center">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Save your first code snippet to get started'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredItems.map(item => (
              <LibraryItemCard
                key={item.id}
                item={item}
                categories={categories}
                onUse={() => handleUseCode(item)}
                onDelete={() => deleteItem(item.id)}
                onView={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Preview Modal */}
      {selectedItem && (
        <ItemPreviewModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUse={() => handleUseCode(selectedItem)}
        />
      )}
    </div>
  );
};

const LibraryItemCard: React.FC<{
  item: LibraryItem;
  categories: any[];
  onUse: () => void;
  onDelete: () => void;
  onView: () => void;
}> = ({ item, categories, onUse, onDelete, onView }) => {
  const category = categories.find(c => c.id === item.category);
  
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.language}</p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <Button size="sm" variant="ghost" onClick={onView} className="h-8 w-8 p-0">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-3">
        <CodePreviewMini code={item.code} language={item.language} maxLines={3} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
              {category.icon} {category.name}
            </span>
          )}
        </div>
        <Button size="sm" onClick={onUse} className="bg-blue-600 hover:bg-blue-700">
          Use Code
        </Button>
      </div>
    </div>
  );
};

const ItemPreviewModal: React.FC<{
  item: LibraryItem;
  onClose: () => void;
  onUse: () => void;
}> = ({ item, onClose, onUse }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.language} • {item.code.split('\n').length} lines</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onUse} className="bg-blue-600 hover:bg-blue-700">
              Use Code
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        <div className="p-4 overflow-auto max-h-96">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
            <code>{item.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Library;
