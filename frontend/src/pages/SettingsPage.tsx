import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { authService } from "@/services/authService";

const SettingsPage = () => {
  const { user, fetchMe } = useAuthStore();

  const [form, setForm] = useState<{
    displayName: string;
    phone: string;
    bio: string;
    avatarUrl: string;
    file?: File;
  }>({
    displayName: user?.displayName || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  });

  // 👉 Sync avatar khi user thay đổi ( reload / fetchMe / login )
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        displayName: user.displayName || "",
        phone: user.phone || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      }));
    }
  }, [user]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // 1️⃣ Upload avatar nếu có file
      if (form.file) {
        const res = await authService.uploadAvatar(form.file);

        setForm((prev) => ({
          ...prev,
          avatarUrl: res.avatarUrl,
          file: undefined,
        }));
      }

      // 2️⃣ Update thông tin khác
      await authService.updateProfile({
        displayName: form.displayName,
        phone: form.phone,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
      });

      await fetchMe();
      toast.success("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    }
  };

  // 👉 Nếu backend trả /uploads/avatar.png → thêm domain
  const fullAvatar = form.avatarUrl;
  return (
    <div className="p-4 bg-white rounded-xl shadow h-full">
      <h2 className="text-xl font-bold mb-4">Cài đặt tài khoản</h2>

      <div className="flex gap-6 md:flex-row flex-col overflow-hidden">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full border overflow-hidden flex-shrink-0">
          <img src={fullAvatar} className="w-full h-full object-cover" />
        </div>

        {/* Form */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          <div>
            <label className="font-medium">Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const preview = URL.createObjectURL(file);

                setForm({
                  ...form,
                  avatarUrl: preview,
                  file,
                });
              }}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Tên hiển thị</label>
            <input
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Giới thiệu</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={4}
            />
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
