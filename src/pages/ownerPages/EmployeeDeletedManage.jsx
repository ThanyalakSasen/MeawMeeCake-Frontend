import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiRefreshCcw } from "react-icons/fi";
import Swal from "sweetalert2";
import SideBarMenu from "../../components/SideBarMenu";
import NavBar from "../../components/NavBar";
import { InputField } from "../../components/inputField";
import api from "../../service/api";

export default function EmployeeDeletedManage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/auth/admin/deleted-employees");
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (employeeId) => {
    const result = await Swal.fire({
      title: "ยืนยันการกู้คืนพนักงาน",
      text: "คุณต้องการกู้คืนพนักงานคนนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "กู้คืน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    // ถ้ากด Cancel
    if (!result.isConfirmed) return;

    try {
      const response = await api.put(
        `/api/auth/admin/employees/${employeeId}/restore`,
      );

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "กู้คืนสำเร็จ",
          text: "กู้คืนข้อมูลพนักงานเรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchEmployees();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถกู้คืนพนักงานได้",
      });
    }
  };

  const handlePermanentDelete = async (employeeId) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบข้อมูลถาวร",
      text: "คุณต้องการลบข้อมูลพนักงานคนนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    // ถ้ากด Cancel
    if (!result.isConfirmed) return;

    try {
      const response = await api.delete(
        `/api/auth/admin/employees/${employeeId}/hardDeleted`,
      );

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "ลบข้อมูลสำเร็จ",
          text: "ลบข้อมูลพนักงานเรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchEmployees();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถลบข้อมูลพนักงานได้",
      });
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.user_fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.emp_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
      <Row className="g-0" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <Col md={3} lg={3} className="bg-white">
          <SideBarMenu />
        </Col>

        <Col md={9} lg={9} style={{ backgroundColor: "#F0F0FA" }}>
          <div className="p-3">
            <NavBar titleMain="รายชื่อพนักงานที่ถูกลบ" />
          </div>

          <div
            style={{
              backgroundColor: "#fff",
              padding: "2%",
              borderRadius: "10px",
              margin: "0% 4%",
            }}
          >
            <Row className="align-items-center p-0 w-80">
              <Col md={6}>
                <form
                  style={{ display: "flex", gap: "10px" }}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <InputField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาชื่อ, อีเมล, รหัสพนักงาน"
                  />
                </form>
              </Col>
            </Row>
          </div>

          {/* Table */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2%",
              borderRadius: "10px",
              margin: "2% 4%",
            }}
          >
            <Table striped bordered hover responsive>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>รหัสพนักงาน</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>อีเมล</th>
                  <th>เบอร์โทรศัพท์</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <Spinner animation="border" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5">
                      <Alert variant="danger">{error}</Alert>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      ไม่พบข้อมูลพนักงาน
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id} style={{ textAlign: "center" }}>
                      <td>{employee.emp_id || "-"}</td>
                      <td>{employee.user_fullname}</td>
                      <td>{employee.email}</td>
                      <td>{employee.user_phone || "-"}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => handleRestore(employee._id)}
                        >
                          <FiRefreshCcw /> กู้คืน
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handlePermanentDelete(employee._id)}
                        >
                          <FiTrash2 /> ลบถาวร
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
