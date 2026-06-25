const API_URL = "http://localhost:8000/api";

// Authentication
export const login = async (data: any) => {
  console.log("Login:", data);

  // Later:
  // const res = await fetch(`${API_URL}/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // return res.json();
};

export const register = async (data: any) => {
  console.log("Register:", data);
};

// Products
export const getProducts = async () => {
  console.log("Get Products");
};

export const getProduct = async (id: number) => {
  console.log("Get Product:", id);
};

export const createProduct = async (data: any) => {
  console.log("Create Product:", data);
};

export const updateProduct = async (id: number, data: any) => {
  console.log("Update Product:", id, data);
};

export const deleteProduct = async (id: number) => {
  console.log("Delete Product:", id);
};

// Messages
export const getMessages = async () => {
  console.log("Get Messages");
};

export const sendMessage = async (data: any) => {
  console.log("Send Message:", data);
};