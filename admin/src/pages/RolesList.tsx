import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { rolesApi, type Role, type CreateRoleInput } from "@/api/roles";
import { Plus, Pencil, Trash2 } from "lucide-react";

export function RolesList() {
  const [addOpen, setAddOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const queryClient = useQueryClient();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setEditRole(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Roles</h1>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new role
        </Button>
      </div>

      <div className="rounded-md border border-gray-200 bg-white">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No roles yet.
                  </TableCell>
                </TableRow>
              ) : (
                roles?.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {r.description ?? "—"}
                    </TableCell>
                    <TableCell>{r.userCount ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditRole(r)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Delete this role?")) {
                              deleteMutation.mutate(r.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <RoleDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => {
          setAddOpen(false);
          queryClient.invalidateQueries({ queryKey: ["roles"] });
        }}
      />
      {editRole && (
        <RoleDialog
          open={!!editRole}
          onOpenChange={(open) => !open && setEditRole(null)}
          role={editRole}
          onSuccess={() => {
            setEditRole(null);
            queryClient.invalidateQueries({ queryKey: ["roles"] });
          }}
        />
      )}
    </div>
  );
}

function RoleDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (open) {
      setName(role?.name ?? "");
      setDescription(role?.description ?? "");
    }
  }, [open, role]);

  const createMutation = useMutation({
    mutationFn: (data: CreateRoleInput) => rolesApi.create(data),
    onSuccess: () => onSuccess(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; description?: string }) =>
      rolesApi.update(role!.id, data),
    onSuccess: () => onSuccess(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role) {
      updateMutation.mutate({ name, description });
    } else {
      createMutation.mutate({ name, description });
    }
  };

  const mutating = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Edit role" : "Add new role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error && (
            <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">
              {(error as Error).message}
            </p>
          ))}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Editor"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutating}>
              {mutating ? "Saving…" : role ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
