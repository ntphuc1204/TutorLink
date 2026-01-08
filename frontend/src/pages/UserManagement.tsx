import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { useAuthStore } from "../stores/useAuthStore";

type Role = "student" | "teacher" | "admin";

const roleBadgeClass: Record<Role, string> = {
  student: "bg-blue-100 text-blue-600",
  teacher: "bg-green-100 text-green-600",
  admin: "bg-red-100 text-red-600",
};

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // popup
  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  const deleteUser = useAuthStore((s) => s.deleteUser);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();

      const filtered = data.filter(
        (u: any) => u.role?.toLowerCase() !== "admin"
      );

      setUsers(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateUser = async () => {
    try {
      await authService.updateUser(editUser._id, editUser);
      toast.success("Cập nhật người dùng thành công!");
      setOpenEdit(false);
      fetchUsers();
    } catch (e) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      await deleteUser(id);
      fetchUsers();
    } catch (e) {
      toast.error("Xóa thất bại!");
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:flex-row flex-col">
        <div>
          <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
          <p className="text-gray-500 mt-1">
            Tổng cộng: <b>{users.length}</b> tài khoản
          </p>
        </div>

        <div className="relative">
          <input
            placeholder="Tìm kiếm username hoặc email..."
            className="border pl-10 pr-3 py-2 w-full rounded-xl w-72 focus:ring-2 focus:ring-blue-300 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          ⏳ Đang tải danh sách người dùng...
        </div>
      )}

      {/* Empty */}
      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Không tìm thấy người dùng nào 😢
        </div>
      )}

      {/* Table */}
      {!loading && filteredUsers.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-blue-100 shadow-xl">
          <div className=" overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 uppercase text-sm">
                  <th className="p-4 text-left">Người dùng</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left w-32">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t border-gray-200 hover:bg-blue-50/60 transition-all duration-150"
                  >
                    <td className="p-4 flex items-center gap-3 flex md:flex-row flex-col">
                      <img
                        src={
                          u.avatarUrl ||
                          "https://ui-avatars.com/api/?background=45A7E6&color=fff&name=" +
                            u.username
                        }
                        className="w-10 h-10 rounded-full border shadow-sm"
                      />

                      <div className="">
                        <p className="font-semibold text-gray-800">
                          {u.username}
                        </p>
                        <p className="text-xs text-gray-500">{u.displayName}</p>
                      </div>
                    </td>

                    <td className="p-4 text-gray-700">{u.email}</td>

                    <td className="p-0 md:p-4">
                      <span
                        className={
                          "px-3 py-1 rounded-full text-sm font-medium shadow-sm " +
                          roleBadgeClass[u.role as Role]
                        }
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-0 md:p-4 flex gap-2 flex md:flex-row flex-col">
                      <button
                        className="
                          text-blue-600 
                          hover:text-white 
                          hover:bg-blue-500 
                          px-0 md:px-3 py-1 
                          rounded-lg 
                          transition
                          text-sm
                        "
                        onClick={() => {
                          setEditUser(u);
                          setOpenEdit(true);
                        }}
                      >
                        Chỉnh sửa
                      </button>

                      <button
                        className="
                          text-red-600 
                          hover:text-white 
                          hover:bg-red-500 
                          px-3 py-1 
                          rounded-lg 
                          transition
                          text-sm
                        "
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Popup Edit */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[420px] shadow-2xl border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ✏️ Cập nhật người dùng
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Username</label>
                <input
                  className="border rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  className="border rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tên hiển thị</label>
                <input
                  className="border rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={editUser.displayName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, displayName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                onClick={() => setOpenEdit(false)}
              >
                Hủy
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                onClick={handleUpdateUser}
              >
                💾 Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
