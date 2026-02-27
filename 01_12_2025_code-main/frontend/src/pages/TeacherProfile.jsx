import { useEffect, useState } from "react";
import { User, Phone, IdCard, Lock, Loader, Loader2 } from "lucide-react";
import Footer from "../components/footer";
import Header from "../components/header";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "./Subject";

export default function ProfessorProfile() {
  const [isEdit, setIsEdit] = useState(false);

  const [professor, setProfessor] = useState({});

  const getProfessor = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("loginToken")).data;
      const res = await axios.get(API_URL + `/get-professor/${token.id}`);
      setProfessor(res.data.data);
    } catch (error) {
      console.error(error);
      Swal.fire("โปรดตรวจสอบเครือข่ายแล้วลองอีกครั้ง", "", "error");
    }
  };
  useEffect(() => {
    getProfessor();
  }, []);

  const [formData, setFormData] = useState(professor);

  const handleEdit = () => {
    setFormData(professor);
    setIsEdit(true);
  };

  const handleCancel = () => {
    setFormData(professor);
    setIsEdit(false);
  };

  const [load, setLoad] = useState(false);
  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("loginToken")).data;
      const res = await axios.put(
        API_URL + `/update-professor/${token.id}`,
        formData,
      );
      if (res.data.err) {
        return Swal.fire(res.data.err, "", "warning");
      }

      if (res.status === 200) {
        Swal.fire("บันทึกข้อมูลสำเร็จ", "", "success");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("โปรดตรสจสอบเครือข่าย", "", "error");
    } finally {
      setLoad(false);
    }
    setProfessor(formData);
    setIsEdit(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold">โปรไฟล์อาจารย์</h1>
            <p className="text-sm opacity-90">ข้อมูลส่วนตัวอาจารย์ผู้สอน</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Fullname */}
            <ProfileItem
              icon={<User />}
              label="ชื่อ-นามสกุล"
              value={formData.fullname || professor?.fullname}
              isEdit={isEdit}
              onChange={(v) => setFormData({ ...formData, fullname: v })}
            />

            {/* Username (readonly) */}
            <ProfileItem
              icon={<IdCard />}
              label="รหัสผู้ใช้งาน"
              value={formData.username || professor.username}
              disabled
            />

            {/* Telephone */}
            <ProfileItem
              icon={<Phone />}
              label="หมายเลขโทรศัพท์"
              value={formData.tel || professor.tel}
              isEdit={isEdit}
              onChange={(v) => setFormData({ ...formData, tel: v })}
            />

            {/* Password */}
            <div className="flex items-center gap-4 opacity-60">
              <Lock className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">รหัสผ่าน</p>
                <p className="font-semibold">••••••••</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 flex justify-end gap-3">
            {!isEdit ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                แก้ไขข้อมูล
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  ยกเลิก
                </button>
                <button
                  disabled={load}
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  {load ? <Loader2 className="animate-spin" /> : "  บันทึก"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

/* ---------- Reusable Component ---------- */
function ProfileItem({
  icon,
  label,
  value,
  isEdit,
  onChange,
  disabled = false,
}) {
  console.log("🚀 ~ ProfileItem ~ value:", value);
  return (
    <div className="flex items-center gap-4">
      <div className="text-blue-500">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>

        {isEdit && !disabled ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <p className="font-semibold text-gray-800">{value}</p>
        )}
      </div>
    </div>
  );
}
