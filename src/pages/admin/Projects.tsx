import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Search, Edit, Trash2, Eye, TrendingUp, DollarSign, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Project {
  id: string;
  project_name: string;
  client_name: string;
  client_email: string | null;
  status: string;
  creation_date: string;
  delivery_date: string | null;
  earning_amount: number;
  cost_amount: number;
  is_public: boolean;
  cover_image: string | null;
}

const statusColors: Record<string, string> = {
  lead: 'bg-gray-500',
  proposal: 'bg-blue-500',
  approved: 'bg-cyan-500',
  in_progress: 'bg-yellow-500',
  review: 'bg-purple-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusLabels: Record<string, string> = {
  lead: 'Lead',
  proposal: 'Proposal',
  approved: 'Approved',
  in_progress: 'In Progress',
  review: 'Review',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEarnings: 0,
    totalCosts: 0,
    totalProfit: 0,
    monthlyEarnings: 0,
    monthlyCosts: 0,
    monthlyProfit: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else if (data) {
      setProjects(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (projectsData: Project[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalEarnings = 0;
    let totalCosts = 0;
    let monthlyEarnings = 0;
    let monthlyCosts = 0;

    projectsData.forEach(project => {
      totalEarnings += Number(project.earning_amount) || 0;
      totalCosts += Number(project.cost_amount) || 0;

      const creationDate = new Date(project.creation_date);
      if (creationDate.getMonth() === currentMonth && creationDate.getFullYear() === currentYear) {
        monthlyEarnings += Number(project.earning_amount) || 0;
        monthlyCosts += Number(project.cost_amount) || 0;
      }
    });

    setStats({
      totalProjects: projectsData.length,
      totalEarnings,
      totalCosts,
      totalProfit: totalEarnings - totalCosts,
      monthlyEarnings,
      monthlyCosts,
      monthlyProfit: monthlyEarnings - monthlyCosts,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Project deleted successfully.' });
      fetchProjects();
    }
  };

  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your client projects</p>
        </div>
        <Button asChild>
          <Link to="/visage/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">£{stats.totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">£{stats.totalCosts.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              £{stats.totalProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Stats */}
      <Card>
        <CardHeader>
          <CardTitle>This Month Overview</CardTitle>
          <CardDescription>Financial summary for {format(new Date(), 'MMMM yyyy')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Earnings</p>
              <p className="text-xl font-bold text-green-600">£{stats.monthlyEarnings.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Costs</p>
              <p className="text-xl font-bold text-red-600">£{stats.monthlyCosts.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profit</p>
              <p className={`text-xl font-bold ${stats.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                £{stats.monthlyProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead className="text-right">Earning</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead>Public</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => {
                  const profit = Number(project.earning_amount) - Number(project.cost_amount);
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.project_name}</TableCell>
                      <TableCell>{project.client_name}</TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[project.status]} text-white`}>
                          {statusLabels[project.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(project.creation_date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        {project.delivery_date ? format(new Date(project.delivery_date), 'dd MMM yyyy') : '-'}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        £{Number(project.earning_amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        £{Number(project.cost_amount).toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        £{profit.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={project.is_public ? 'default' : 'secondary'}>
                          {project.is_public ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/visage/projects/${project.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
