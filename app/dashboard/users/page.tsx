"use client";
import { useState } from "react";
import { Plus, Users, Pencil, Trash2, Shield, User as UserIcon } from "lucide-react";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserFormDialog } from "@/components/users/user-form-dialog";
import type { User } from "@/lib/schemas";

export default function UsersPage() {
  const { user: authUser } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";
  const { data, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const usersList = data?.data || [];

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5" style={{ color: "#7c6fe6" }} />
            <span className="text-sm font-medium" style={{ color: "#7c6fe6" }}>
              Management
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Manage team members and their roles.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={handleCreate}
            className="shrink-0 font-medium"
            style={{
              background: "linear-gradient(135deg, #7c6fe6, #5b4fcf)",
              color: "white",
              border: "none",
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      {/* Content */}
      <Card className="border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase border-b bg-black/20" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y relative">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex justify-center items-center gap-2">
                       <span className="animate-pulse">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                usersList.map((usr: User) => (
                  <tr key={usr.id} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                        {usr.name.charAt(0).toUpperCase()}
                      </div>
                      {usr.name}
                    </td>
                    <td className="px-6 py-4" style={{ color: "var(--muted-foreground)" }}>
                      {usr.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={usr.role === "ADMIN" ? "default" : "secondary"} className="gap-1 px-2.5 py-0.5">
                        {usr.role === "ADMIN" ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                        {usr.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4" style={{ color: "var(--muted-foreground)" }}>
                      {new Date(usr.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Only Admin can edit/delete others, or user can edit themselves if we allow, but req says:
                            "only admin create and delete soho user full crud operation korte perbe. And jar role user se only get request and update korte perbe."
                            This likely means user can update their own data, but typically from a profile page. Let's just allow Update for their own row if USER.
                        */}
                        {/* Only Admin can edit or delete users */}
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            onClick={() => handleEdit(usr)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {isAdmin && authUser?.id !== usr.id && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this user?")) {
                                deleteUser.mutate(usr.id);
                              }
                            }}
                            disabled={deleteUser.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <UserFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        user={editingUser}
      />
    </div>
  );
}
