import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ColumnVisibilityPopover } from "@/components/ColumnVisibilityPopover";
import { useColumnVisibility } from "@/hooks/useColumnVisibility";
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
import { useToast } from "@/components/ui/use-toast";
import { usersApi, type UserListItem, type CreateUserInput } from "@/api/users";
import { rolesApi, type Role } from "@/api/roles";
import { Pagination } from "@/components/Pagination";
import { Plus, Pencil, Trash2 } from "lucide-react";

const USERS_PER_PAGE_KEY = "users-per-page";

const USERS_TABLE_COLUMNS = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "roles", label: "Roles" },
  { id: "active", label: "Active" },
];

export function UsersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserListItem | null>(null);
  const { visibleColumnIds, visibleColumnsOrdered, toggleColumn } =
    useColumnVisibility(USERS_TABLE_COLUMNS, undefined, "users-column-visibility");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [limit, setLimit] = useState(() => {
    const s = localStorage.getItem(USERS_PER_PAGE_KEY);
    const n = s ? parseInt(s, 10) : NaN;
    return Number.isNaN(n) || n < 1 ? 20 : Math.min(n, 100);
  });
  useEffect(() => {
    localStorage.setItem(USERS_PER_PAGE_KEY, String(limit));
  }, [limit]);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, limit, searchDebounced],
    queryFn: () => usersApi.list({ page, limit, search: searchDebounced || undefined }),
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditUser(null);
      toast.success("User deleted");
    },
    onError: (err) =>
      toast.error((err as Error)?.message ?? "Something went wrong"),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchDebounced(search);
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
          <ColumnVisibilityPopover
            columns={USERS_TABLE_COLUMNS}
            visibleColumnIds={visibleColumnIds}
            onToggleColumn={toggleColumn}
          />
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Invite new user
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumnsOrdered.map((col) => (
                  <TableHead key={col.id}>{col.label}</TableHead>
                ))}
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnsOrdered.length + 1} className="text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((u) => (
                  <TableRow key={u.id}>
                    {visibleColumnsOrdered.map((col) => (
                      <TableCell key={col.id} className={col.id === "name" ? "font-medium" : undefined}>
                        {col.id === "name" && `${u.firstName} ${u.lastName}`}
                        {col.id === "email" && u.email}
                        {col.id === "roles" && (
                          <div className="flex flex-wrap gap-1">
                            {u.roles.map((r) => (
                              <Badge key={r.id} variant="secondary">
                                {r.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {col.id === "active" && (
                          <Badge variant={u.active ? "success" : "destructive"}>
                            {u.active ? "Active" : "Inactive"}
                          </Badge>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditUser(u)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Delete this user?")) {
                              deleteMutation.mutate(u.id);
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

      <Pagination
        page={page}
        totalPages={totalPages}
        total={data?.total ?? 0}
        limit={limit}
        limitOptions={[10, 20, 50, 100]}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
      />

      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        roles={roles ?? []}
        onSuccess={() => {
          setInviteOpen(false);
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }}
      />
      {editUser && (
        <EditUserDialog
          user={editUser}
          open={!!editUser}
          onOpenChange={(open) => !open && setEditUser(null)}
          roles={roles ?? []}
          onSuccess={() => {
            setEditUser(null);
            queryClient.invalidateQueries({ queryKey: ["users"] });
          }}
        />
      )}
    </div>
  );
}

function InviteUserDialog({
  open,
  onOpenChange,
  roles,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<CreateUserInput & { confirmPassword: string }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleIds: [],
  });

  const { toast } = useToast();
  const createMutation = useMutation({
    mutationFn: (data: CreateUserInput) => usersApi.create(data),
    onSuccess: () => {
      toast.success("User invited");
      onSuccess();
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleIds: [],
      });
    },
    onError: (err) =>
      toast.error((err as Error)?.message ?? "Something went wrong"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword || form.roleIds.length === 0) return;
    createMutation.mutate({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      roleIds: form.roleIds,
    });
  };

  const toggleRole = (roleId: string) => {
    setForm((f) => ({
      ...f,
      roleIds: f.roleIds.includes(roleId)
        ? f.roleIds.filter((id) => id !== roleId)
        : [...f.roleIds, roleId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite new user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {createMutation.isError && (
            <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">
              {(createMutation.error as Error).message}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Password (temporary)</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm password</Label>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleRole(r.id)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    form.roleIds.includes(r.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createMutation.isPending ||
                form.roleIds.length === 0 ||
                form.password !== form.confirmPassword
              }
            >
              {createMutation.isPending ? "Creating…" : "Create user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditUserDialog({
  user,
  open,
  onOpenChange,
  roles,
  onSuccess,
}: {
  user: UserListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roleIds: user.roles.map((r) => r.id),
    active: user.active,
  });

  const { toast } = useToast();
  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof usersApi.update>[1]) =>
      usersApi.update(user.id, data),
    onSuccess: () => {
      toast.success("User updated");
      onSuccess();
    },
    onError: (err) =>
      toast.error((err as Error)?.message ?? "Something went wrong"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const toggleRole = (roleId: string) => {
    setForm((f) => ({
      ...f,
      roleIds: f.roleIds.includes(roleId)
        ? f.roleIds.filter((id) => id !== roleId)
        : [...f.roleIds, roleId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {updateMutation.isError && (
            <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">
              {(updateMutation.error as Error).message}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleRole(r.id)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    form.roleIds.includes(r.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
