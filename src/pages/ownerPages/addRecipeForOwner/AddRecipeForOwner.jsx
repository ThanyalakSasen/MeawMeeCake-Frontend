import { useParams } from "react-router-dom";
import { useViewModel } from "./viewmodel";
import { BsTrash, BsPlus } from "react-icons/bs";
import Layout from "../../../components/Layout";
import { InputField } from "../../../components/inputField";
import { SelectInput } from "../../../components/selectInput";
import { Row, Col, Spinner, Form } from "react-bootstrap";

export default function AddRecipeForOwner() {
  const { newProductId } = useParams();
  const {
    recipeNameTh,
    setRecipeNameTh,
    recipeYield,
    setRecipeYield,
    ingredientOptions,
    categoryId,
    setCategoryId,
    ingredients,
    handleAddIngredientRow,
    handleIngredientChange,
    handleDeleteIngredientRow,
    isLoading,
    handleSubmit,
  } = useViewModel(newProductId);

  return (
    <Layout titleMain="เพิ่มสูตร">
      <Row className="m-3">
        <Col md={10} className="w-100">
          <div className="p-4 bg-white rounded">
            <form onSubmit={handleSubmit}>
              <Row
                className="g-5"
                style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
              >
                <Col md={6}>
                  <InputField
                    label="ชื่อสูตร"
                    value={recipeNameTh}
                    onChange={(e) => setRecipeNameTh(e.target.value)}
                  />
                  <InputField
                    label="จำนวนที่ได้ (ต่อการอบ 1 ครั้ง)"
                    type="number"
                    value={recipeYield}
                    onChange={(e) => setRecipeYield(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <SelectInput
                    label="หมวดหมู่"
                    options={ingredientOptions}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  />
                </Col>
              </Row>
              <Row
                className="g-5"
                style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
              >
                <Col md={6}>
                  <Form.Label>ส่วนผสม</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Label>ปริมาณ</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Label>หน่วย</Form.Label>
                </Col>
              </Row>
              {ingredients.map((ing) => (
                <Row
                  className="g-5"
                  style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
                  key={ing.id}
                >
                  <Col md={6}>
                    <SelectInput
                      options={ingredientOptions}
                      value={ing.ingredient}
                      onChange={(e) =>
                        handleIngredientChange(
                          ing.id,
                          "ingredient",
                          e.target.value,
                        )
                      }
                    />
                  </Col>
                  <Col md={3}>
                    <InputField
                      type="number"
                      value={ing.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          ing.id,
                          "quantity",
                          e.target.value,
                        )
                      }
                    />
                  </Col>
                  <Col md={2}>
                    <InputField
                      value={ing.unit}
                      onChange={(e) =>
                        handleIngredientChange(ing.id, "unit", e.target.value)
                      }
                    />
                  </Col>
                  <Col
                    md={1}
                    className="d-flex justify-content-center"
                    style={{ paddingTop: "9px" }}
                  >
                    <BsTrash
                      size={18}
                      className="text-danger"
                      onClick={() => handleDeleteIngredientRow(ing.id)}
                    />
                  </Col>
                </Row>
              ))}
              <div className="text-end" style={{ paddingRight: "3rem" }}>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={handleAddIngredientRow}
                >
                  <BsPlus size={18} />
                  วัตถุดิบ
                </button>
              </div>

              <div className="text-center mt-4">
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
    </Layout>
  );
}
