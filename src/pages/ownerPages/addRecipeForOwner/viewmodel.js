import { useState } from "react";

export const useViewModel = (productId) => {
  const [recipeNameTh, setRecipeNameTh] = useState("");
  const [recipeYield, setRecipeYield] = useState("");

  // Ingredient states
  const [ingredientOptions, setIngredientOptions] = useState([
    { value: "", label: "กรุณาเลือกส่วนผสม" },
  ]);
  const [categoryId, setCategoryId] = useState("");
  const [ingredients, setIngredients] = useState([
    {
      id: `0`,
      ingredient: "",
      quantity: "",
      unit: "",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleAddIngredientRow = () => {
    const newRow = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ingredient: "",
      quantity: "",
      unit: "",
    };

    setIngredients((prev) => [...prev, newRow]);
  };

  const handleIngredientChange = (id, field, value) => {
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDeleteIngredientRow = (id) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return {
    recipeNameTh,
    setRecipeNameTh,
    recipeYield,
    setRecipeYield,
    ingredientOptions,
    setIngredientOptions,
    categoryId,
    setCategoryId,
    ingredients,
    setIngredients,
    handleAddIngredientRow,
    handleIngredientChange,
    handleDeleteIngredientRow,
    productId,
    isLoading,
    setIsLoading,
    handleSubmit,
  };
};
