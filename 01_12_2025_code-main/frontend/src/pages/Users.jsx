import { useEffect, useState } from "react";
import {
   Trash2,
  Home,
  User,
  AlertCircle,
  GraduationCap,
  Edit2,
  X,
  Save,
  Loader2,
  UserPlus,
  } from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import Header from "../components/header";
import Footer from "../components/footer";
import Swal from "sweetalert2";

export default function Users() {
    const [students, setStudents] = useState([]);
  const [load, setLoad] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    major: "",
    studentId: "",
  });

  const getAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/students`);
      setStudents(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      fullname: student.fullname,
      username: student.username,
      password: "",
      major: student.major,
      studentId: student.std_class_id,
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({ fullname: "", username: "", password: "", major: "", studentId: "" });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({ fullname: "", username: "", password: "", major: "", studentId: "" });
  };

  const handleSubmit = async () => {
    if (!formData.fullname || !formData.username || !formData.major) {
      return Swal.fire("กรุณากรอกข้อมูลให้ครบ", "", "warning");
    }
    if (!editingStudent && (!formData.password || !formData.studentId)) {
      return Swal.fire("กรุณากรอกข้อมูลให้ครบ", "", "warning");
    }

    try {
      setSaving(true);
      if (editingStudent) {
        const res = await axios.put(
          `${API_URL}/students/${editingStudent.student_id}`,
          {
            fullname: formData.fullname,
            major: formData.major,
          }
        );
        if (res.data.err)
          return Swal.fire(res.data.err, "", "warning");
        Swal.fire("แก้ไขข้อมูลแล้ว", "", "success");
      } else {
        const res = await axios.post(`${API_URL}/create-std`, {
          fullName: formData.fullname,
          studentId: formData.studentId,
          username: formData.username,
          password: formData.password,
        });
        if (res.data.err)
          return Swal.fire(res.data.err, "", "warning");
        Swal.fire("เพิ่มนักศึกษาแล้ว", "", "success");
      }
      getAll();
      resetForm();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const { isConfirmed } = await Swal.fire({
      title: "ยืนยันการลบ",
      text: `ต้องการลบ ${name} ใช่หรือไม่?`,
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "ลบ",
      denyButtonText: "ยกเลิก",
      confirmButtonColor: "#EF4444",
      denyButtonColor: "#6B7280",
    });
    if (!isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/students/${id}`);
      Swal.fire("ลบข้อมูลแล้ว", "", "success");
      getAll();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "", "error");
    }
  };

  if (load) return <p>กำลังโหลด...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 py-8 px-4">
      <Header />
      <div className="max-w-7xl mx-auto mt-16">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => (location.href = "/dashboard")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-blue-50 text-gray-700 rounded-xl transition-all shadow-md hover:shadow-lg border border-blue-100"
            >

            </button>
            <div className="flex items-center gap-3">

                <h1 className="text-2xl font-bold text-gray-800">
                  จัดการนักศึกษา
                </h1>
                <p className="text-sm text-gray-600">ดูและจัดการข้อมูลนักศึกษา</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-sky-600 transition-all shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            เพิ่มนักศึกษา
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-blue-500 to-sky-500 px-6 py-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                <span className="font-semibold text-lg">
                  นักศึกษาทั้งหมด: {students.length} คน
                </span>
              </div>
              <div className="text-sm bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                แสดง {students.length} รายการ
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    รหัสนักศึกษา
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    สาขาวิชา
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {student.std_class_id || student?.student_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {student.fullname}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.major}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.username}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="font-medium">แก้ไข</span>
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(student.student_id, student.fullname)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-medium">ลบ</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <AlertCircle className="w-12 h-12 text-gray-400" />
                        <p className="text-lg font-medium">ไม่พบข้อมูลนักศึกษา</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {students.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                แสดง{" "}
                <span className="font-semibold text-gray-800">
                  {students.length}
                </span>{" "}
                รายการ
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal เพิ่ม/แก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingStudent ? "แก้ไขข้อมูลนักศึกษา" : "เพิ่มนักศึกษาใหม่"}
              </h2>
              <button
                onClick={resetForm}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* รหัสนักศึกษา — แสดงเฉพาะตอนเพิ่มใหม่ */}
              {!editingStudent && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    รหัสนักศึกษา
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                    placeholder="65XXXXXXX"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  placeholder="สมชาย ใจดี"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  สาขาวิชา
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) =>
                    setFormData({ ...formData, major: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  placeholder="วิทยาการคอมพิวเตอร์"
                />
              </div>
              {/* Username และ Password — แสดงเฉพาะตอนเพิ่มใหม่ */}
              {!editingStudent && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                      placeholder="student01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                      placeholder="รหัสผ่าน"
                    />
                  </div>
                </>
              )}
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white rounded-xl transition-all shadow-md font-medium"
              >
                {saving ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}