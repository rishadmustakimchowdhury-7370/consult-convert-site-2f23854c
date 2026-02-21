import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, GripVertical, Menu, ChevronRight, ChevronDown, FileText, Link as LinkIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MenuItem {
  id: string;
  title: string;
  link: string;
  location: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
}

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [preselectedParent, setPreselectedParent] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<'custom' | 'page'>('custom');
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    location: 'header',
    parent_id: 'none',
    is_active: true,
  });

  useEffect(() => {
    fetchMenuItems();
    fetchPages();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_menu')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
      // Auto-expand items that have children
      const parents = new Set<string>();
      (data || []).forEach(item => {
        if (item.parent_id) parents.add(item.parent_id);
      });
      setExpandedItems(parents);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({ title: 'Error fetching menu items', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('id, title, slug, status')
        .eq('status', 'published')
        .order('title', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const getChildren = useCallback((parentId: string) => {
    return menuItems.filter(item => item.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);
  }, [menuItems]);

  const getRootItems = useCallback(() => {
    return menuItems.filter(item => !item.parent_id).sort((a, b) => a.sort_order - b.sort_order);
  }, [menuItems]);

  // Get all possible parent items (any item can be a parent)
  const getAllPossibleParents = useCallback((excludeId?: string): MenuItem[] => {
    return menuItems.filter(item => item.id !== excludeId);
  }, [menuItems]);

  // Get depth of an item
  const getDepth = useCallback((itemId: string): number => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item || !item.parent_id) return 0;
    return 1 + getDepth(item.parent_id);
  }, [menuItems]);

  // Get parent label with hierarchy
  const getParentLabel = useCallback((item: MenuItem): string => {
    const depth = getDepth(item.id);
    const prefix = '—'.repeat(depth);
    return prefix ? `${prefix} ${item.title}` : item.title;
  }, [getDepth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.link.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const parentId = formData.parent_id === 'none' ? null : formData.parent_id;
    const siblings = parentId ? getChildren(parentId) : getRootItems();

    const menuData = {
      title: formData.title.trim(),
      link: formData.link.trim(),
      location: formData.location,
      parent_id: parentId,
      is_active: formData.is_active,
      sort_order: editingItem ? editingItem.sort_order : siblings.length,
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('navigation_menu')
          .update(menuData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: 'Menu item updated successfully' });
      } else {
        const { error } = await supabase
          .from('navigation_menu')
          .insert(menuData);

        if (error) throw error;
        toast({ title: 'Menu item created successfully' });
      }

      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({ title: 'Error saving menu item', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item and all its children?')) return;

    try {
      // Recursively delete all descendants
      const deleteRecursive = async (parentId: string) => {
        const children = menuItems.filter(item => item.parent_id === parentId);
        for (const child of children) {
          await deleteRecursive(child.id);
        }
        await supabase.from('navigation_menu').delete().eq('id', parentId);
      };

      await deleteRecursive(id);
      
      toast({ title: 'Menu item deleted successfully' });
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({ title: 'Error deleting menu item', variant: 'destructive' });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setPreselectedParent(null);
    setLinkType('custom');
    setFormData({
      title: item.title,
      link: item.link,
      location: item.location || 'header',
      parent_id: item.parent_id || 'none',
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleAddSubmenu = (parentItem: MenuItem) => {
    setEditingItem(null);
    setPreselectedParent(parentItem.id);
    setLinkType('custom');
    setFormData({
      title: '',
      link: '',
      location: parentItem.location,
      parent_id: parentItem.id,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handlePageSelect = (pageSlug: string) => {
    const page = pages.find(p => p.slug === pageSlug);
    if (page) {
      setFormData({
        ...formData,
        title: formData.title || page.title,
        link: `/${pageSlug}`,
      });
    }
  };

  const handlePredefinedSelect = (title: string, link: string) => {
    setFormData({ ...formData, title, link });
  };

  const resetForm = () => {
    setEditingItem(null);
    setPreselectedParent(null);
    setLinkType('custom');
    setFormData({
      title: '',
      link: '',
      location: 'header',
      parent_id: 'none',
      is_active: true,
    });
    setIsDialogOpen(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDragItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(itemId);
  };

  const handleDragEnd = () => {
    setDragItem(null);
    setDragOverItem(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragItem || dragItem === targetId) {
      handleDragEnd();
      return;
    }

    const draggedItem = menuItems.find(i => i.id === dragItem);
    const targetItem = menuItems.find(i => i.id === targetId);
    if (!draggedItem || !targetItem) {
      handleDragEnd();
      return;
    }

    // Move dragged item to same parent as target, right after target
    const targetParentId = targetItem.parent_id;
    const siblings = menuItems
      .filter(i => i.parent_id === targetParentId && i.id !== dragItem)
      .sort((a, b) => a.sort_order - b.sort_order);

    const targetIndex = siblings.findIndex(i => i.id === targetId);
    siblings.splice(targetIndex + 1, 0, { ...draggedItem, parent_id: targetParentId });

    // Update sort orders
    try {
      const updates = siblings.map((item, index) => 
        supabase
          .from('navigation_menu')
          .update({ sort_order: index, parent_id: targetParentId })
          .eq('id', item.id)
      );
      await Promise.all(updates);
      toast({ title: 'Menu order updated' });
      fetchMenuItems();
    } catch (error) {
      console.error('Error reordering:', error);
      toast({ title: 'Error reordering menu', variant: 'destructive' });
    }

    handleDragEnd();
  };

  // Move item up/down within its siblings
  const moveItem = async (itemId: string, direction: 'up' | 'down') => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const siblings = menuItems
      .filter(i => i.parent_id === item.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const currentIndex = siblings.findIndex(i => i.id === itemId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    // Swap sort orders
    const currentOrder = siblings[currentIndex].sort_order;
    const targetOrder = siblings[targetIndex].sort_order;

    try {
      await Promise.all([
        supabase.from('navigation_menu').update({ sort_order: targetOrder }).eq('id', siblings[currentIndex].id),
        supabase.from('navigation_menu').update({ sort_order: currentOrder }).eq('id', siblings[targetIndex].id),
      ]);
      fetchMenuItems();
    } catch (error) {
      console.error('Error moving item:', error);
    }
  };

  const getLocationBadge = (location: string) => {
    switch (location) {
      case 'header':
        return <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Header</span>;
      case 'footer':
        return <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Footer</span>;
      case 'both':
        return <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Both</span>;
      default:
        return null;
    }
  };

  const renderMenuTree = (parentId: string | null, depth: number, locationFilter: 'header' | 'footer') => {
    const items = menuItems
      .filter(item => item.parent_id === parentId)
      .sort((a, b) => a.sort_order - b.sort_order);

    const filteredItems = parentId === null
      ? items.filter(item => item.location === locationFilter || item.location === 'both')
      : items; // Children inherit visibility from parent

    if (filteredItems.length === 0) return null;

    return (
      <div className={depth > 0 ? 'ml-6 border-l-2 border-primary/20 pl-3 space-y-1' : 'space-y-1'}>
        {filteredItems.map((item) => {
          const children = getChildren(item.id);
          const hasChildren = children.length > 0;
          const isExpanded = expandedItems.has(item.id);
          const isDragging = dragItem === item.id;
          const isDragOver = dragOverItem === item.id;

          return (
            <div key={item.id}>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isDragging ? 'opacity-50' : ''
                } ${isDragOver ? 'ring-2 ring-primary bg-primary/10' : 'bg-muted/50 hover:bg-muted'}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                  {hasChildren && (
                    <button onClick={() => toggleExpand(item.id)} className="shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  )}
                  {!hasChildren && depth > 0 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.link}</p>
                  </div>
                  {depth === 0 && getLocationBadge(item.location)}
                  {!item.is_active && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded shrink-0">
                      Inactive
                    </span>
                  )}
                  {hasChildren && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0">
                      {children.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSubmenu(item)}
                    className="text-xs h-7 px-2"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Sub
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(item)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>

              {hasChildren && isExpanded && renderMenuTree(item.id, depth + 1, locationFilter)}
            </div>
          );
        })}
      </div>
    );
  };

  const predefinedLinks = [
    { title: 'Home', link: '/' },
    { title: 'About Us', link: '/about' },
    { title: 'Services', link: '/services' },
    { title: 'Blog', link: '/blog' },
    { title: 'Contact', link: '/contact' },
    { title: 'Privacy Policy', link: '/privacy-policy' },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Manager</h1>
          <p className="text-muted-foreground mt-1">Drag & drop to reorder. Add unlimited nested submenus.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Menu Item' : preselectedParent ? 'Add Submenu Item' : 'Add New Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {preselectedParent && (
              <div className="p-3 bg-primary/10 rounded-lg text-sm">
                <span className="text-muted-foreground">Adding submenu under: </span>
                <span className="font-medium">
                  {menuItems.find(i => i.id === preselectedParent)?.title}
                </span>
              </div>
            )}

            {!editingItem && (
              <Tabs value={linkType} onValueChange={(v) => setLinkType(v as 'custom' | 'page')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="custom" className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Custom Link
                  </TabsTrigger>
                  <TabsTrigger value="page" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Select Page
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="page" className="space-y-3 mt-4">
                  <div>
                    <Label className="text-sm font-medium">Website Sections</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {predefinedLinks.map((link) => (
                        <Button
                          key={link.link}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => handlePredefinedSelect(link.title, link.link)}
                        >
                          {link.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {pages.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Published Pages</Label>
                      <Select onValueChange={handlePageSelect}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a page" />
                        </SelectTrigger>
                        <SelectContent>
                          {pages.map((page) => (
                            <SelectItem key={page.id} value={page.slug}>
                              {page.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Menu item title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link">Link *</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="/page-url or https://..."
                required
              />
              <p className="text-xs text-muted-foreground">
                Use / for internal links (e.g., /about) or full URL for external links
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Show In *</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select where to show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header Only</SelectItem>
                  <SelectItem value="footer">Footer Only</SelectItem>
                  <SelectItem value="both">Both Header & Footer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {!preselectedParent && (
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Menu (Optional)</Label>
                <Select
                  value={formData.parent_id}
                  onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No parent (top level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (top level)</SelectItem>
                    {getAllPossibleParents(editingItem?.id).map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {getParentLabel(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active (visible on website)</Label>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="w-5 h-5" />
              Header Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderMenuTree(null, 0, 'header') || (
              <p className="text-muted-foreground text-center py-8">No header menu items yet. Click "Add Menu Item" to create one.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="w-5 h-5" />
              Footer Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderMenuTree(null, 0, 'footer') || (
              <p className="text-muted-foreground text-center py-8">No footer menu items yet. Click "Add Menu Item" to create one.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
