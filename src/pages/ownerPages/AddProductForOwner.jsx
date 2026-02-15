import { useState } from "react";
import { InputField } from "../../components/inputField";
import SideBarMenu from "../../components/SideBarMenu";
import { SelectInput } from "../../components/selectInput";
import ImageUpload from "../../components/imageUploadComponent";
import NavBar from "../../components/NavBar";
import { Row, Col, Alert, Spinner, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../service/api";

export default function AddProductForOwner() {
  const [productNameTh, setProductNameTh] = useState("");
  const [productNameEng, setProductNameEng] = useState("");
  const [productType, setProductType] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [preparationHeating, setPreparationHeating] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [image, setImage] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const productTypes = [
    { value: "", label: "กรุณาเลือกประเภทสินค้า" },
    { value: "ขนมปัง", label: "ขนมปัง" },
    { value: "เค้ก", label: "เค้ก" },
    { value: "คัพเค้ก", label: "คัพเค้ก" },
    { value: "Sourdough", label: "Sourdough" },
  ];

  const recipeOptions = [
    { value: "", label: "กรุณาเลือกสูตรอาหาร" },
    { value: "64a7f0c2e4b0f5b1c8d6e1a1", label: "สูตรที่ 1" },
    { value: "64a7f0c2e4b0f5b1c8d6e1a2", label: "สูตรที่ 2" },
  ];

  const [hasHeatingMethod, setHasHeatingMethod] = useState(null);

  const handleHasHeatingMethodChange = (value) => {
    setHasHeatingMethod(value);
    if (value) {
      setPreparationHeating("");
    } else {
      setPreparationHeating("ไม่มีวิธีการเตรียมอุ่น");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (
      !productNameTh ||
      !productNameEng ||
      !productType ||
      !productPrice
    ) {
      setErrorMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    // แสดง SweetAlert2 เพื่อยืนยัน
    const result = await Swal.fire({
      title: "ยืนยันการเพิ่มสินค้า",
      html: `
        <div style="text-align: left;">
          <p><strong>ชื่อสินค้า:</strong> ${productNameTh} / ${productNameEng}</p>
          <p><strong>ประเภท:</strong> ${productType}</p>
          <p><strong>ราคา:</strong> ${productPrice} บาท</p>
          </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    // ถ้ากด Cancel
    if (!result.isConfirmed) return;

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("product_name_th", productNameTh);
      formData.append("product_name_eng", productNameEng);
      formData.append("product_type", productType);
      formData.append("product_price", productPrice);
      formData.append("product_description", productDescription);
      formData.append("preparation_heating", preparationHeating);
      
      // Only append recipe_id if it's selected
      if (recipeId && recipeId !== "") {
        formData.append("recipe_id", recipeId);
      }

      if (image) {
        formData.append("product_img", image);
      }

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/products/create-product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success || response.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "เพิ่มสินค้าสำเร็จ!",
          text: "สินค้าได้ถูกเพิ่มเข้าระบบแล้ว",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#3085d6",
        });

        // รีเซ็ตฟอร์ม
        setProductNameTh("");
        setProductNameEng("");
        setProductType("");
        setProductNameEng("");
        setProductType("");
        setProductPrice("");
        setProductDescription("");
        setRecipeId("");
        setImage(null);
      }
    } catch (error) {
      console.error("Add Product Error:", error);

      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถเพิ่มสินค้าได้",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Row>
      <Col md={3} className="p-0">
        <SideBarMenu />
      </Col>

      <Col md={9} style={{ backgroundColor: "#F0F0FA", minHeight: "100vh" }}>
        <NavBar titleMain="เพิ่มสินค้าใหม่" />

        <Row className="m-3">
          <Col md={10} className="w-100">
            <div className="p-4 bg-white rounded">
              <form onSubmit={handleSubmit}>
                <Row className="m-4 align-items-center">
                  <ImageUpload image={image} setImage={setImage} />
                </Row>

                <Row>
                  {/* LEFT */}
                  <Col md={6}>
                    <InputField
                      label="ชื่อสินค้า (ภาษาไทย) *"
                      value={productNameTh}
                      onChange={(e) => setProductNameTh(e.target.value)}
                    />
                    <InputField
                      label="ชื่อสินค้า (ภาษาอังกฤษ) *"
                      value={productNameEng}
                      onChange={(e) => setProductNameEng(e.target.value)}
                    />
                    <InputField
                      label="ราคาสินค้า (บาท) *"
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                    />
                  </Col>

                  {/* RIGHT */}
                  <Col md={6}>
                    <SelectInput
                      label="ประเภทสินค้า *"
                      options={productTypes}
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    />
                    <SelectInput
                      label="สูตรอาหาร (ถ้ามี)"
                      options={recipeOptions}
                      value={recipeId}
                      onChange={(e) => setRecipeId(e.target.value)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <InputField
                      label="คำอธิบายสินค้า"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                  </Col>
                  <div style={{ marginBottom: "16px", marginTop: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "12px",
                        fontWeight: "500",
                      }}
                    >
                      มีวิธีการเตรียมอุ่น/เก็บรักษาหรือไม่
                    </label>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <Form.Check
                        type="radio"
                        id="has-heating-method-yes"
                        name="hasHeatingMethod"
                        label="มี"
                        checked={hasHeatingMethod === true}
                        onChange={() => handleHasHeatingMethodChange(true)}
                        style={{ cursor: "pointer" }}
                      />
                      <Form.Check
                        type="radio"
                        id="has-heating-method-no"
                        name="hasHeatingMethod"
                        label="ไม่มี"
                        checked={hasHeatingMethod === false}
                        onChange={() => handleHasHeatingMethodChange(false)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                  {hasHeatingMethod === true && (
                    <Col md={12}>
                      <InputField
                        label="วิธีการเตรียมอุ่น"
                        value={preparationHeating}
                        onChange={(e) => setPreparationHeating(e.target.value)}
                      />
                    </Col>
                  )}
                </Row>

                {/* แสดงข้อความสำเร็จหรือผิดพลาด */}
                {successMessage && (
                  <Alert variant="success" className="mt-3">
                    {successMessage}
                  </Alert>
                )}
                {errorMessage && (
                  <Alert variant="danger" className="mt-3">
                    {errorMessage}
                  </Alert>
                )}

                <div className="text-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        กำลังบันทึก...
                      </>
                    ) : (
                      "บันทึกข้อมูล"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
