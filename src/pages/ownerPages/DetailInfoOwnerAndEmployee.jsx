import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Spinner,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import InformationEmployeeForOwner from "../../components/informationEmplyeeForOwner";
import NavBar from "../../components/NavBar";
import SideBarMenu from "../../components/SideBarMenu";
import api from "../../service/api";

export default function DetailInfoOwnerAndEmployee() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        // ดึงข้อมูลพนักงานจาก API
        const response = await api.get(`/api/auth/admin/employee/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setEmployee(response.data.data);
        } else {
          setError("ไม่พบข้อมูลพนักงาน");
        }
      } catch (error) {
        console.error("Fetch Employee Error:", error);
        setError(
          error.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEmployeeDetail();
    }
  }, [userId, navigate]);

  // Loading state
  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Spinner
          animation="border"
          variant="warning"
          style={{ width: "60px", height: "60px" }}
        />
        <p style={{ marginTop: "20px", color: "#666", fontSize: "18px" }}>
          กำลังโหลดข้อมูล...
        </p>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container fluid style={{ minHeight: "100vh", backgroundColor: "#F0F0FA" }}>
        <Row className="g-0">
          <Col md={3} className="p-0 bg-white">
            <SideBarMenu />
          </Col>
          <Col md={9} className="p-0">
            <NavBar titleMain="รายละเอียดพนักงาน" />
            <div className="p-4">
              <Alert variant="danger">
                <h4>เกิดข้อผิดพลาด</h4>
                <p>{error}</p>
              </Alert>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid style={{ minHeight: "100vh", backgroundColor: "#F0F0FA" }}>
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} className="p-0 bg-white">
          <SideBarMenu />
        </Col>

        {/* Main */}
        <Col md={9} className="p-0">
          <NavBar titleMain="รายละเอียดพนักงาน" />
          <InformationEmployeeForOwner employee={employee} />
        </Col>
      </Row>
    </Container>
  );
}
