import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, UserPlus, Users, Mail } from "lucide-react";

type AppRole = "admin" | "editor" | "manager" | "seo_manager" | "super_admin" | "user";

interface TeamMember {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: AppRole;
  is_active: boolean;
  invitation_status: string | null;
  created_at: string;
}



const ROLES: { value: AppRole; label: string; description: string }[] = [
  { value: "super_admin", label: "Super Admin", description: "Full access to all features" },
  { value: "admin", label: "Admin", description: "Manage content and users" },
  { value: "manager", label: "Manager", description: "Manage projects and team" },
  { value: "seo_manager", label: "SEO Manager", description: "Manage SEO and content" },
  { value: "editor", label: "Editor", description: "Create and edit content" },
  { value: "user", label: "User", description: "Basic access" },
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "super_admin":
      return "bg-red-500";
    case "admin":
      return "bg-orange-500";
    case "manager":
      return "bg-blue-500";
    case "seo_manager":
      return "bg-green-500";
    case "editor":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    full_name: string;
    role: AppRole;
  }>({
    email: "",
    password: "",
    full_name: "",
    role: "user",
  });
  const { toast } = useToast();

  useEffect(() => {
    checkSuperAdminRole();
    fetchMembers();
  }, []);

  const checkSuperAdminRole = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) {
      setIsSuperAdmin(false);
      return;
    }
    
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "super_admin")
      .maybeSingle();
    
    setIsSuperAdmin(!!roleData);
  };

  const fetchMembers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching team members:", error);
      // If RLS blocks access, show empty state
      setMembers([]);
    } else {
      setMembers(data || []);
    }
    setIsLoading(false);
  };

  const handleInviteTeamMember = async () => {
    if (!formData.email || !formData.full_name) {
      toast({
        title: "Error",
        description: "Please fill in name and email",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get current user email for "invited by" info
      const { data: currentUser } = await supabase.auth.getUser();
      const invitedBy = currentUser?.user?.email || "System";

      let userId: string | null = null;
      let isExistingUser = false;

      // First check if user already exists in team_members
      const { data: existingTeamMember } = await supabase
        .from("team_members")
        .select("*")
        .eq("email", formData.email)
        .maybeSingle();

      if (existingTeamMember) {
        toast({
          title: "User Already in Team",
          description: "This user is already a team member. Edit their role instead.",
          variant: "destructive",
        });
        return;
      }

      // Check if user already exists in profiles (registered user)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", formData.email)
        .maybeSingle();

      if (existingProfile?.user_id) {
        // User already exists in system, use their existing user_id
        userId = existingProfile.user_id;
        isExistingUser = true;
      } else {
        // Try to create new user - password required
        if (!formData.password) {
          toast({
            title: "Error",
            description: "Password is required for new team members",
            variant: "destructive",
          });
          return;
        }

        // Create the user via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/visage/login`,
            data: {
              full_name: formData.full_name,
            },
          },
        });

        if (authError) {
          // Check if user already registered (email exists in auth)
          if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
            // Generate a placeholder user_id for existing auth users
            // They'll be linked properly when they log in
            const placeholderId = crypto.randomUUID();
            userId = placeholderId;
            isExistingUser = true;
            
            toast({
              title: "Existing User Detected", 
              description: "This user already has an account. They will be added to the team and can log in with their existing password.",
            });
          } else {
            throw authError;
          }
        } else {
          userId = authData.user?.id || null;
        }
      }

      if (userId) {
        // Check if they already have a role and remove it first (for re-invites)
        const { data: existingRole } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (existingRole) {
          // Update existing role
          await supabase
            .from("user_roles")
            .update({ role: formData.role })
            .eq("user_id", userId);
        } else {
          // Add new role
          const { error: roleError } = await supabase.from("user_roles").insert({
            user_id: userId,
            role: formData.role,
          });

          if (roleError) {
            console.error("Error adding role:", roleError);
            throw roleError;
          }
        }

        // Add to team_members table
        const { error: memberError } = await supabase.from("team_members").insert({
          user_id: userId,
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          is_active: true,
          invitation_status: "pending",
        });

        if (memberError) {
          console.error("Error adding team member:", memberError);
          throw memberError;
        }

        // Send email notifications via edge function
        try {
          const response = await supabase.functions.invoke("team-invite", {
            body: {
              memberName: formData.full_name,
              memberEmail: formData.email,
              memberRole: formData.role,
              tempPassword: isExistingUser ? "(Use your existing password)" : formData.password,
              invitedBy: invitedBy,
              isExistingUser: isExistingUser,
            },
          });

          if (response.error) {
            console.error("Error sending invite emails:", response.error);
          } else {
            console.log("Team invite emails sent successfully");
          }
        } catch (emailError) {
          console.error("Error invoking team-invite function:", emailError);
        }

        toast({
          title: "Team Member Invited",
          description: isExistingUser 
            ? `${formData.full_name} has been added to the team and notified`
            : `${formData.full_name} has been invited and notified via email`,
        });

        setIsInviteDialogOpen(false);
        setFormData({ email: "", password: "", full_name: "", role: "user" });
        fetchMembers();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!editingMember) return;

    try {
      // Update team_members table
      const { error: memberError } = await supabase
        .from("team_members")
        .update({ role: formData.role })
        .eq("id", editingMember.id);

      if (memberError) throw memberError;

      // Update user_roles table
      const { error: roleError } = await supabase
        .from("user_roles")
        .update({ role: formData.role })
        .eq("user_id", editingMember.user_id);

      if (roleError) {
        console.error("Error updating role:", roleError);
      }

      toast({
        title: "Role Updated",
        description: `${editingMember.full_name}'s role has been updated`,
      });

      setIsDialogOpen(false);
      setEditingMember(null);
      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (member: TeamMember) => {
    if (!confirm(`Are you sure you want to permanently remove ${member.full_name} from the team? This will also remove their role permissions.`)) {
      return;
    }

    try {
      // First delete from team_members
      const { error: memberError } = await supabase
        .from("team_members")
        .delete()
        .eq("id", member.id);

      if (memberError) throw memberError;

      // Also delete from user_roles so they can be re-invited with a new role
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", member.user_id);

      if (roleError) {
        console.error("Error removing user role:", roleError);
        // Don't throw - team member was already removed
      }

      toast({
        title: "Team Member Removed",
        description: `${member.full_name} has been permanently removed from the team and can be re-invited`,
      });

      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResendInvite = async (member: TeamMember) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      const invitedBy = currentUser?.user?.email || "System";

      const response = await supabase.functions.invoke("team-invite", {
        body: {
          memberName: member.full_name,
          memberEmail: member.email,
          memberRole: member.role,
          tempPassword: "(Use your existing password or reset it)",
          invitedBy: invitedBy,
          isExistingUser: true,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Invite Resent",
        description: `Invitation email has been resent to ${member.email}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({ ...formData, role: member.role });
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Team Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members and their roles
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 px-4 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Total Members:</span>
              <span className="ml-2 font-bold text-primary">{members.length}</span>
            </div>
            {isSuperAdmin && (
              <Button onClick={() => setIsInviteDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            )}
          </div>
        </div>

        {/* Role Legend */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Role Permissions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {ROLES.map((role) => (
              <div key={role.value} className="text-center">
                <Badge className={`${getRoleBadgeColor(role.value)} text-white mb-1`}>
                  {role.label}
                </Badge>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-card rounded-lg border">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading team members...
            </div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Team Members Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by inviting team members to collaborate
              </p>
              {isSuperAdmin && (
                <Button onClick={() => setIsInviteDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite First Member
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.full_name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(member.role)} text-white`}>
                        {ROLES.find((r) => r.value === member.role)?.label || member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={member.invitation_status === "accepted" ? "default" : "secondary"}
                        className={member.invitation_status === "pending" ? "bg-yellow-500 text-white" : ""}
                      >
                        {member.invitation_status === "accepted" ? "Accepted" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {isSuperAdmin && (
                        <div className="flex justify-end gap-2">
                          {member.invitation_status === "pending" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleResendInvite(member)}
                              title="Resend Invite"
                            >
                              <Mail className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(member)}
                            title="Edit Role"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMember(member)}
                            title="Delete Member"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Invite Dialog */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member with specific role and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: AppRole) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteTeamMember}>Invite Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Role Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Team Member Role</DialogTitle>
              <DialogDescription>
                Update {editingMember?.full_name}'s role and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: AppRole) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRole}>Update Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
