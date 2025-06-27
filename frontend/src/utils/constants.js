export const API_BASE_URL = "http://localhost:3000/api";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },
  JSON: {
    GENERATE: "/json/generate",
    GENERATE_AI: "/json/generate-ai",
    TEMPLATES: "/json/templates",
    VALIDATE: "/json/validate",
  },
  EXCEL: {
    CONVERT: "/excel/convert",
    DOWNLOAD: "/excel/download",
  },
};

export const TEMPLATES = [
  { id: "user", name: "User Profile", icon: "👤" },
  { id: "product", name: "Product Data", icon: "📦" },
  { id: "employee", name: "Employee Data", icon: "👔" },
  { id: "company", name: "Company Data", icon: "🏢" },
  { id: "post", name: "Blog Post", icon: "📝" },
];
