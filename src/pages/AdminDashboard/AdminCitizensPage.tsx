import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { adminApi, Citizen } from "../../services/api";
import { useAuth } from "../../contexts/AdminAuthContext";
import { Plus, Trash2, X } from "lucide-react";

const emptyCitizen = {
  national_id: "",
  first_name: "",
  gender: "" as Citizen["gender"] | "",
  status: "alive" as Citizen["status"],
};

const AdminCitizensPage = () => {
  const { t } = useLanguage();
  const { hasRole } = useAuth();
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Citizen | null>(null);
  const [form, setForm] = useState(emptyCitizen);

  const canManage = hasRole("admin");
  const canView = hasRole("admin", "supervisor");

  useEffect(() => {
    if (!canView) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminApi.listCitizens({ page: 1, pageSize: 100 });
        setCitizens(res);
      } catch (e) {
        console.error(e);
        setError(t("error.loadCitizens"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [canView, t]);
  console.log(citizens);

  const openCreateDialog = () => {
    setEditing(null);
    setForm(emptyCitizen);
    setIsDialogOpen(true);
  };

  const openEditDialog = (citizen: Citizen) => {
    setEditing(citizen);
    setForm({
      national_id: citizen.national_id,
      first_name: citizen.first_name || "",
      gender: citizen.gender || "",
      status: citizen.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) return;
    setLoading(true);
    setError(null);
    try {
      if (editing) {
        await adminApi.updateCitizen(editing.id, {
          national_id: form.national_id,
          first_name: form.first_name || undefined,
          gender: form.gender || undefined,
          status: form.status,
        });
      } else {
        // Build payload with only non-empty values
        const createPayload: any = {
          national_id: form.national_id,
        };
        if (form.first_name) createPayload.first_name = form.first_name;
        if (form.gender) createPayload.gender = form.gender;
        if (form.status) createPayload.status = form.status;

        console.log(
          "[AdminCitizensPage] Creating citizen with payload:",
          createPayload
        );
        await adminApi.createCitizen(createPayload);
      }
      setIsDialogOpen(false);
      setEditing(null);
      setForm(emptyCitizen);
      // Reload citizens list after successful save
      const res = await adminApi.listCitizens({ page: 1, pageSize: 100 });
      setCitizens(res);
    } catch (e: any) {
      console.error("Error saving citizen:", e);
      // Extract error message from backend response if available
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data?.error ||
        t("error.saveCitizen");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!canManage) return;
    if (!window.confirm(t("admin.citizens.deleteConfirm") || "Delete citizen?"))
      return;
    setLoading(true);
    setError(null);
    try {
      await adminApi.deleteCitizen(id);
      const res = await adminApi.listCitizens({ page: 1, pageSize: 100 });
      setCitizens(res);
    } catch (e) {
      console.error(e);
      setError(t("error.deleteCitizen"));
    } finally {
      setLoading(false);
    }
  };

  if (!canView) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{t("admin.citizens.title")}</h1>
        <p className="text-sm text-gray-500">
          {t("admin.noCitizensPermission")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.citizens.title")}</h1>
          <p className="text-sm text-gray-500">
            {t("admin.citizens.subtitle")}
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="btn-primary flex items-center gap-2"
            onClick={openCreateDialog}
          >
            <Plus className="w-4 h-4" />
            {t("admin.citizens.create")}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-center py-3 px-2 font-semibold">
                {t("admin.citizens.nationalId")}
              </th>
              <th className="text-center py-3 px-2 font-semibold">
                {t("admin.citizens.fullName")}
              </th>
              <th className="text-center py-3 px-2 font-semibold">
                {t("admin.citizens.gender")}
              </th>
              <th className="text-center py-3 px-2 font-semibold">
                {t("admin.citizens.status")}
              </th>
              {canManage && (
                <th className="text-center py-3 px-2 font-semibold">
                  {t("admin.actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {citizens.map((citizen) => (
              <tr key={citizen.id} className="border-b border-gray-100">
                <td className="text-center py-3 px-2 font-mono text-sm">
                  {citizen.national_id}
                </td>
                <td className="text-center py-3 px-2 text-gray-700">
                  {citizen.first_name || "----"}
                </td>
                <td className="text-center py-3 px-2 capitalize">
                  {citizen.gender
                    ? citizen.gender === "male"
                      ? t("admin.citizens.genderMale")
                      : t("admin.citizens.genderFemale")
                    : t("admin.citizens.genderNotSet")}
                </td>
                <td className="text-center py-3 px-2 capitalize">
                  {citizen.status === "alive"
                    ? t("admin.citizens.statusAlive")
                    : t("admin.citizens.statusDead")}
                </td>
                {canManage && (
                  <td className="flex justify-center py-3 px-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        onClick={() => openEditDialog(citizen)}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                        onClick={() => handleDelete(citizen.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                        {t("common.delete")}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {!citizens.length && !loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  {t("admin.noCitizensFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editing
                  ? t("admin.citizens.update")
                  : t("admin.citizens.create")}
              </h2>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("admin.citizens.nationalId")}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.national_id}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        national_id: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("admin.citizens.fullName")}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.first_name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("admin.citizens.gender")}
                  </label>
                  <select
                    className="input-field"
                    value={form.gender || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        gender: e.target.value as Citizen["gender"],
                      }))
                    }
                  >
                    <option value="">{t("admin.citizens.genderNotSet")}</option>
                    <option value="male">
                      {t("admin.citizens.genderMale")}
                    </option>
                    <option value="female">
                      {t("admin.citizens.genderFemale")}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("admin.citizens.status")}
                  </label>
                  <select
                    className="input-field"
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as Citizen["status"],
                      }))
                    }
                  >
                    <option value="alive">
                      {t("admin.citizens.statusAlive")}
                    </option>
                    <option value="dead">
                      {t("admin.citizens.statusDead")}
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {editing ? t("admin.citizens.update") : t("common.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCitizensPage;
