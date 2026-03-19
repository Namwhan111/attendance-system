import { useEffect, useState } from "react";
import {
    Trash2,
    Home,
    AlertCircle,
    UserCog,
    Edit2,
    X,
    Save,
    Loader2,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import Header from "../components/header";
import Footer from "../components/footer";
import Swal from "sweetalert2";

export default function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [load, setLoad] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        password: "",
        tel: "",
    });

    const getAll = async () => {
        try {
            const res = await axios.get(`${API_URL}/get-all-professors`);
            setTeachers(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        getAll();
    }, []);

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setFormData({
            fullname: teacher.fullname,
            username: teacher.username,
            password: "",
            tel: teacher.tel || "",
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingTeacher(null);
        setFormData({ fullname: "", username: "", password: "", tel: "" });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setIsModalOpen(false);
        setEditingTeacher(null);
        setFormData({ fullname: "", username: "", password: "", tel: "" });
    };

    const handleSubmit = async () => {
        if (!formData.fullname || !formData.username) {
            return Swal.fire("กรุณากรอกข้อมูลให้ครบ", "", "warning");
        }
        if (!editingTeacher && !formData.password) {
            return Swal.fire("กรุณากรอกรหัสผ่าน", "", "warning");
        }
        try {
            setSaving(true);
            if (editingTeacher) {
                const res = await axios.put(
                    `${API_URL}/update-professor/${editingTeacher.id}`,
                    formData
                );
                if (res.data.err) return Swal.fire(res.data.err, "", "warning");
                Swal.fire("แก้ไขข้อมูลแล้ว", "", "success");
            } else {
                const res = await axios.post(`${API_URL}/create-professor`, formData);
                if (res.data.err) return Swal.fire(res.data.err, "", "warning");
                Swal.fire("เพิ่มอาจารย์แล้ว", "", "success");
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
            await axios.delete(`${API_URL}/delete-professor/${id}`);
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
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    จัดการอาจารย์
                                </h1>
                                <p className="text-sm text-gray-600">
                                    ดูและจัดการข้อมูลอาจารย์ผู้สอน
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all shadow-lg"
                    >
                        <UserCog className="w-5 h-5" />
                        เพิ่มอาจารย์
                    </button>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                    {/* Stats Bar */}
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <UserCog className="w-6 h-6" />
                                <span className="font-semibold text-lg">
                                    อาจารย์ทั้งหมด: {teachers.length} คน
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        ลำดับ
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        ชื่อ-นามสกุล
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Username
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        เบอร์โทร
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                        จัดการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {teachers.length > 0 ? (
                                    teachers.map((teacher, index) => (
                                        <tr
                                            key={teacher.id}
                                            className="hover:bg-blue-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                {teacher.fullname}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {teacher.username}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {teacher.tel || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(teacher)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span className="font-medium">แก้ไข</span>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(teacher.id, teacher.fullname)
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
                                                <p className="text-lg font-medium">
                                                    ไม่พบข้อมูลอาจารย์
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    {teachers.length > 0 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                แสดง{" "}
                                <span className="font-semibold text-gray-800">
                                    {teachers.length}
                                </span>{" "}
                                รายการ
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                {editingTeacher ? "แก้ไขข้อมูลอาจารย์" : "เพิ่มอาจารย์ใหม่"}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
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
                                    placeholder="อาจารย์สมชาย ใจดี"
                                />
                            </div>
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
                                    placeholder="teacher01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password{" "}
                                    {editingTeacher && (
                                        <span className="text-gray-400 font-normal">
                                            (เว้นว่างถ้าไม่ต้องการเปลี่ยน)
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                                    placeholder={
                                        editingTeacher ? "เว้นว่างถ้าไม่เปลี่ยน" : "รหัสผ่าน"
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    เบอร์โทร
                                </label>
                                <input
                                    type="tel"
                                    value={formData.tel}
                                    onChange={(e) =>
                                        setFormData({ ...formData, tel: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                                    placeholder="08XXXXXXXX"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl transition-all shadow-md font-medium"
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