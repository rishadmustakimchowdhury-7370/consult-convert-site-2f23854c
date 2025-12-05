import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, GripVertical, Menu, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  title: string;
  link: string;
  location: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [preselectedParent, setPreselectedParent] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    location: 'header',
    parent_id: '',
    is_active: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('navigation_menu')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching menu items', variant: 'destructive' });
    } else {
      setMenuItems(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const menuData = {
      title: formData.title,
      link: formData.link,
      location: formData.location,
      parent_id: formData.parent_id || null,
      is_active: formData.is_active,
      sort_order: editingItem ? editingItem.sort_order : menuItems.length,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('navigation_menu')
        .update(menuData)
        .eq('id', editingItem.id);

      if (error) {
        toast({ title: 'Error updating menu item', variant: 'destructive' });
      } else {
        toast({ title: 'Menu item updated successfully' });
      }
    } else {
      const { error } = await supabase
        .from('navigation_menu')
        .insert(menuData);

      if (error) {
        toast({ title: 'Error creating menu item', variant: 'destructive' });
      } else {
        toast({ title: 'Menu item created successfully' });
      }
    }

    resetForm();
    fetchMenuItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    const { error } = await supabase
      .from('navigation_menu')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting menu item', variant: 'destructive' });
    } else {
      toast({ title: 'Menu item deleted successfully' });
      fetchMenuItems();
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setPreselectedParent(null);
    setFormData({
      title: item.title,
      link: item.link,
      location: item.location || 'header',
      parent_id: item.parent_id || '',
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleAddSubmenu = (parentItem: MenuItem) => {
    setEditingItem(null);
    setPreselectedParent(parentItem.id);
    setFormData({
      title: '',
      link: '',
      location: parentItem.location,
      parent_id: parentItem.id,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setPreselectedParent(null);
    setFormData({
      title: '',
      link: '',
      location: 'header',
      parent_id: '',
      is_active: true,
    });
    setIsDialogOpen(false);
  };

  const parentMenuItems = menuItems.filter(item => !item.parent_id);
  const getSubItems = (parentId: string) => menuItems.filter(item => item.parent_id === parentId);

  const renderMenuItem = (item: MenuItem, location: 'header' | 'footer') => {
    const subItems = getSubItems(item.id);
    const isHeaderOrBoth = item.location === 'header' || item.location === 'both';
    const isFooterOrBoth = item.location === 'footer' || item.location === 'both';
    
    if (location === 'header' && !isHeaderOrBoth) return null;
    if (location === 'footer' && !isFooterOrBoth) return null;

    return (
      <div key={item.id} className="space-y-1">
        {/* Parent Item */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
          <div className="flex items-center gap-3">
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.link}</p>
            </div>
            {!item.is_active && (
              <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                Inactive
              </span>
            )}
            {subItems.length > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {subItems.length} submenu{subItems.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAddSubmenu(item)}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Submenu
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
        
        {/* Sub Items */}
        {subItems.length > 0 && (
          <div className="ml-6 space-y-1 border-l-2 border-primary/20 pl-4">
            {subItems.map((subItem) => (
              <div 
                key={subItem.id} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{subItem.title}</p>
                    <p className="text-xs text-muted-foreground">{subItem.link}</p>
                  </div>
                  {!subItem.is_active && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(subItem)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(subItem.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Manager</h1>
          <p className="text-muted-foreground mt-1">Manage your website navigation menus with submenus</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
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
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Menu item title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="/page-url or https://..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
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
                    <SelectItem value="">No parent (top level)</SelectItem>
                    {parentMenuItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
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
              <Label htmlFor="is_active">Active</Label>
            </div>
            <div className="flex justify-end gap-2">
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
            <div className="space-y-2">
              {parentMenuItems
                .filter(item => item.location === 'header' || item.location === 'both')
                .map((item) => renderMenuItem(item, 'header'))}
              {parentMenuItems.filter(item => item.location === 'header' || item.location === 'both').length === 0 && (
                <p className="text-muted-foreground text-center py-8">No header menu items yet</p>
              )}
            </div>
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
            <div className="space-y-2">
              {parentMenuItems
                .filter(item => item.location === 'footer' || item.location === 'both')
                .map((item) => renderMenuItem(item, 'footer'))}
              {parentMenuItems.filter(item => item.location === 'footer' || item.location === 'both').length === 0 && (
                <p className="text-muted-foreground text-center py-8">No footer menu items yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
