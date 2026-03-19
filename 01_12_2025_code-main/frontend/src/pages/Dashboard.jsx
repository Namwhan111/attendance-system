import { useEffect, useState } from "react";
import {
  User,
  BookOpen,
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Users2,
  Pen,
  Book,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Subject";
import Swal from "sweetalert2";
import Users from "./Users";
import DashboardStat from "../components/Dashboard-stat";
import DashboardStudentRow from "../components/dashboars-student-row";
import DashboardProfessorRow from "../components/dashboard-professor-row";
import DashboardSubjectRow from "../components/dashboard-subject-row";
import Header from "../components/header";
import Footer from "../components/footer";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // const [stats, setStats] = useState({});

  // Sample data
  const [students, setStudents] = useState([
    {
      id: "6501234567",
      name: "สมชาย ใจดี",
      major: "วิทยาการคอมพิวเตอร์",
      email: "somchai@email.com",
    },
    {
      id: "6501234568",
      name: "สมหญิง รักเรียน",
      major: "วิศวกรรมซอฟต์แวร์",
      email: "somying@email.com",
    },
    {
      id: "6501234569",
      name: "ประยุทธ มานะ",
      name: "ระบบสารสนเทศ",
      email: "prayut@email.com",
    },
  ]);

  const [teachers, setTeachers] = useState([
    {
      id: "T001",
      name: "ดร.วิชัย สอนดี",
      email: "wichai@university.ac.th",
      department: "คอมพิวเตอร์",
    },
    {
      id: "T002",
      name: "อ.สมพร ใจเย็น",
      email: "somporn@university.ac.th",
      department: "วิศวกรรม",
    },
    {
      id: "T003",
      name: "ผศ.ดร.นภา วิชาการ",
      email: "napa@university.ac.th",
      department: "วิทยาศาสตร์",
    },
  ]);

  const [subjects, setSubjects] = useState([
    {
      id: "CS101",
      name: "การเขียนโปรแกรมเบื้องต้น",
      credits: "3",
      teacher: "ดร.วิชัย สอนดี",
    },
    {
      id: "CS201",
      name: "โครงสร้างข้อมูล",
      credits: "3",
      teacher: "อ.สมพร ใจเย็น",
    },
    {
      id: "CS301",
      name: "ฐานข้อมูล",
      credits: "3",
      teacher: "ผศ.ดร.นภา วิชาการ",
    },
  ]);

  const [loadAll, setLoadAll] = useState(true);
  const getAllList = async () => {
    try {
      const students = await axios.get(API_URL + "/students");
      setStudents(students.data.data);

      const professors = await axios.get(API_URL + "/get-all-professors");
      setTeachers(professors.data.data);
      console.log(
        "🚀 ~ getAllList ~ professors.data.data:",
        professors.data.data,
      );

      const course = await axios.get(API_URL + "/get-all-subjects");
      setSubjects(course.data.data);

      if (activeTab === "students") {
        setTableData(students.data.data);
      } else if (activeTab === "teachers") {
        setTableData(professors.data.data);
      } else if (activeTab === "subjects") {
        setTableData(course.data.data);
      } else {
        setTableData(students.data.data);
      }
    } catch (error) {
      console.error(error);
      alert("ตรวจสอบเครือข่าย");
    } finally {
      setLoadAll(false);
    }
  };
  useEffect(() => {
    getAllList();
  }, []);

  const [formData, setFormData] = useState({});

  const activeTabData = async () => {
    if (activeTab === "students") {
      setTableData(students);
    }
    if (activeTab === "teachers") {
      setTableData(teachers);
    } else {
      setTableData(subjects);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?")) {
      let api = "";
      if (activeTab === "students") {
        api = `/students/${item?.student_id}`;
      } else if (activeTab === "teachers") {
        api = `/delete-professor/${item?.id}`;
      } else {
        api = `/delete-subject/${item?.course_id}`;
      }
      try {
        const res = await axios.delete(API_URL + api);

        if (res.status === 200) {
          getAllList();
          Swal.fire("ลบข้อมูลแล้ว", "", "success");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("ตรวจสอบเครือข่าย", "", "error");
      }
    }
  };

  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    let api = "";
    console.log(formData);
    if (editingItem) {
      // Update existing
      if (activeTab === "students") {
        api = `/students/${formData?.student_id}`;
      } else if (activeTab === "teachers") {
        api = `/update-professor/${formData?.id}`;
        const username = formData.username?.trim();
        const password = formData.password;
        const tel = formData.tel?.trim();

        // ---------- Username ----------
        if (!username) {
          return Swal.fire("กรุณากรอกรหัสผู้ใช้งาน", "", "error");
        }

        if (username.length < 6) {
          return Swal.fire(
            "รหัสผู้ใช้งานต้องมีอย่างน้อย 6 ตัวอักษร",
            "",
            "error",
          );
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
          return Swal.fire(
            "รหัสผู้ใช้งานใช้ได้เฉพาะ a-z, A-Z และตัวเลข",
            "",
            "error",
          );
        }

        // ---------- Password ----------
        if (!password) {
          return Swal.fire("กรุณากรอกรหัสผ่าน", "", "error");
        }

        if (password.length < 8) {
          return Swal.fire("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร", "", "error");
        }

        if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])/.test(password)) {
          return Swal.fire(
            "รหัสผ่านต้องมี ตัวอักษร + ตัวเลข + อักขระพิเศษ",
            "",
            "error",
          );
        }

        if (username === password) {
          return Swal.fire("รหัสผู้ใช้งานห้ามตรงกับรหัสผ่าน", "", "error");
        }

        // ---------- Telephone ----------
        if (!tel) {
          return Swal.fire("กรุณากรอกหมายเลขโทรศัพท์", "", "error");
        }

        if (!/^0\d{9}$/.test(tel)) {
          return Swal.fire(
            "หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0",
            "",
            "error",
          );
        }
      } else {
        api = `/update-subject/${formData?.course_id}`;
      }
    } else {
      // Add new
      if (activeTab === "students") {
        api = "/create-std";
      } else if (activeTab === "teachers") {
        api = "/create-professor";
        const username = formData.username?.trim();
        const password = formData.password;
        const tel = formData.tel?.trim();

        // ---------- Username ----------
        if (!username) {
          return Swal.fire("กรุณากรอกรหัสผู้ใช้งาน", "", "error");
        }

        if (username.length < 6) {
          return Swal.fire(
            "รหัสผู้ใช้งานต้องมีอย่างน้อย 6 ตัวอักษร",
            "",
            "error",
          );
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
          return Swal.fire(
            "รหัสผู้ใช้งานใช้ได้เฉพาะ a-z, A-Z และตัวเลข",
            "",
            "error",
          );
        }

        // ---------- Password ----------
        if (!password) {
          return Swal.fire("กรุณากรอกรหัสผ่าน", "", "error");
        }

        if (password.length < 8) {
          return Swal.fire("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร", "", "error");
        }

        if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])/.test(password)) {
          return Swal.fire(
            "รหัสผ่านต้องมี ตัวอักษร + ตัวเลข + อักขระพิเศษ",
            "",
            "error",
          );
        }

        if (username === password) {
          return Swal.fire("รหัสผู้ใช้งานห้ามตรงกับรหัสผ่าน", "", "error");
        }

        // ---------- Telephone ----------
        if (!tel) {
          return Swal.fire("กรุณากรอกหมายเลขโทรศัพท์", "", "error");
        }

        if (!/^0\d{9}$/.test(tel)) {
          return Swal.fire(
            "หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0",
            "",
            "error",
          );
        }
      } else {
        api = "/create-subject";
      }
    }

    try {
      setSaving(true);

      let res = null;
      if (editingItem) {
        res = await axios.put(API_URL + api, formData);
      } else {
        res = await axios.post(API_URL + api, formData);
      }
      if (res.data.err) {
        return Swal.fire(res.data.err, "ไม่สามารถบันทึกได้", "warning");
      }

      if (res.status === 200 || res.status === 201) {
        getAllList();
        Swal.fire("บันทึกข้อมูลแล้ว", "", "success");
      }
    } catch (error) {
      console.error(error);
      alert("ตรวจสอบเครือข่าย");
    } finally {
      setSaving(false);
    }
    setShowModal(false);
    setFormData({});
  };

  function searchData(keyword) {
    setTableData(
      tableData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(keyword),
        ),
      ),
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Navbar */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ยินดีต้อนรับ!, Admin Dashboard
          </h2>
          <p className="text-gray-600">
            จัดการข้อมูลนักศึกษา อาจารย์ และรายวิชา
          </p>
        </div>

        {/* Stats Grid */}
        <DashboardStat />


        </div>
     </div>
  );
}

export default Dashboard;
