import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "./Subject";
import CheckClassRow from "../components/check-class-row";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

const CheckClass = () => {
  const { classId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourses] = useState(null);
  const [student, setStudents] = useState([]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/get-subject/${classId}`);
      const data = await response.json();
      setCourses(data.data);
    } catch (error) {
      alert("ไม่สามารถโหลดข้อมูลวิชาได้");
    } finally {
      setLoading(false);
    }
  };

  const getAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/attendance-today/${classId}`);
      setStudents(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    getAll();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-5xl mx-auto">
        <Link
          to={"/crud/subject"}
          className="flex hover:text-blue-500 hover:underline items-center gap-2"
        >
          <ArrowLeft />
          <p>กลับ</p>
        </Link>
      </div>
      <div className="max-w-5xl mt-5 mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              📋 เช็คชื่อเข้าเรียน
            </h1>
            <p className="text-indigo-100">
              {new Date().toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
                weekday: "long",
              })}
            </p>
          </div>

          {/* Course Info */}
          <div className="p-6 bg-gradient-to-br from-white to-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border-2 border-indigo-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">📚 ชื่อวิชา</p>
                <p className="text-lg font-semibold text-gray-800">
                  {course?.course_name || "-"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-indigo-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">🔢 รหัสวิชา</p>
                <p className="text-lg font-semibold text-gray-800">
                  {course?.course_id || "-"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-indigo-100 shadow-sm ">
                <p className="text-sm text-gray-500 mb-1">👨‍🏫 ผู้สอน</p>
                <p className="text-lg font-semibold text-gray-800">
                  {course?.teacher_name || "-"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-indigo-100 shadow-sm ">
                <p className="text-sm text-gray-500 mb-1"> เวลาเข้าเรียน</p>
                <p className="text-lg font-semibold text-gray-800">
                  {course?.time_check || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student List Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                👥 รายชื่อผู้เข้าเรียน
              </h2>
              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                {student.length} คน
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                    ชื่อ - นามสกุล
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                    เวลาเช็คชื่อ
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {student.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <p className="text-lg font-medium">ยังไม่มีนักศึกษาเช็คชื่อวันนี้</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  student.map((s, index) => {
                    const statusStyle = {
                      มาเรียน: "bg-green-100 text-green-800 border-green-300",
                      มาสาย: "bg-orange-100 text-orange-800 border-orange-300",
                      ขาดเรียน: "bg-red-100 text-red-800 border-red-300",
                      ลา: "bg-amber-100 text-amber-800 border-amber-300",
                    };
                    return (
                      <tr key={index} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {s.fullname}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {new Date(s.checkin_time).toLocaleTimeString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} น.
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle[s.status] || "bg-gray-100 text-gray-700"}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 กรุณาตรวจสอบรายชื่อให้ถูกต้องก่อนบันทึก</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckClass;
