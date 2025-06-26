import OpenAI from "openai";
import { configDotenv } from "dotenv";
configDotenv();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Basic templates for template-based generation
const templates = {
  user: () => ({
    id: Math.floor(Math.random() * 1000),
    name: "John Doe",
    email: "john@example.com",
    age: Math.floor(Math.random() * 50) + 18,
    city: "New York",
  }),
  product: () => ({
    id: Math.floor(Math.random() * 1000),
    name: "Sample Product",
    price: Math.floor(Math.random() * 500) + 10,
    category: "Electronics",
    inStock: true,
  }),
  post: () => ({
    id: Math.floor(Math.random() * 1000),
    title: "Sample Blog Post",
    content: "This is sample content for testing.",
    author: "Jane Smith",
    createdAt: new Date().toISOString(),
  }),
  employee: () => ({
    id: Math.floor(Math.random() * 1000),
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    department: "Engineering",
    salary: Math.floor(Math.random() * 50000) + 50000,
    hireDate: new Date().toISOString(),
  }),
  company: () => ({
    id: Math.floor(Math.random() * 1000),
    name: "Tech Corp",
    industry: "Technology",
    employees: Math.floor(Math.random() * 1000) + 10,
    founded: Math.floor(Math.random() * 30) + 1990,
    revenue: Math.floor(Math.random() * 10000000) + 1000000,
  }),
};

// Smart count detection functions
const determineSmartCount = (prompt, userCount) => {
  if (userCount && userCount > 0) {
    return Math.min(userCount, 50);
  }

  const countHints = extractCountFromPrompt(prompt);
  if (countHints) {
    return Math.min(countHints, 50);
  }

  const contextCount = getContextBasedCount(prompt);
  return contextCount;
};

const extractCountFromPrompt = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();

  const numberMatches = prompt.match(/\b(\d+)\b/g);
  if (numberMatches) {
    const num = parseInt(numberMatches[0]);
    if (num > 0 && num <= 100) return num;
  }

  const quantityWords = {
    few: 3,
    several: 5,
    some: 7,
    many: 10,
    multiple: 8,
    bunch: 6,
    list: 10,
    sample: 5,
  };

  for (const [word, count] of Object.entries(quantityWords)) {
    if (lowerPrompt.includes(word)) {
      return count;
    }
  }

  return null;
};

const getContextBasedCount = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();

  if (
    lowerPrompt.includes("user") ||
    lowerPrompt.includes("customer") ||
    lowerPrompt.includes("employee")
  ) {
    return 8;
  }

  if (
    lowerPrompt.includes("product") ||
    lowerPrompt.includes("item") ||
    lowerPrompt.includes("inventory")
  ) {
    return 12;
  }

  if (
    lowerPrompt.includes("transaction") ||
    lowerPrompt.includes("order") ||
    lowerPrompt.includes("payment")
  ) {
    return 15;
  }

  if (
    lowerPrompt.includes("post") ||
    lowerPrompt.includes("article") ||
    lowerPrompt.includes("content")
  ) {
    return 6;
  }

  return 5;
};

const getCountSource = (prompt, userCount) => {
  if (userCount && userCount > 0) {
    return "user_specified";
  }

  if (extractCountFromPrompt(prompt)) {
    return "extracted_from_prompt";
  }

  return "context_based_default";
};

// JSON structure and data validation function
const validateJSONStructure = (data) => {
  try {
    if (typeof data !== "object" || data === null) {
      return { valid: false, error: "Data must be a valid object" };
    }

    if (Object.keys(data).length === 0) {
      return { valid: false, error: "JSON cannot be empty" };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid JSON structure" };
  }
};

const validateArrayConsistency = (dataArray) => {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return { valid: true };
  }

  const firstObjectKeys = Object.keys(dataArray[0]).sort();

  for (let i = 1; i < dataArray.length; i++) {
    const currentKeys = Object.keys(dataArray[i]).sort();

    if (JSON.stringify(firstObjectKeys) !== JSON.stringify(currentKeys)) {
      return {
        valid: false,
        error: `Inconsistent structure at index ${i}. Expected keys: ${firstObjectKeys.join(
          ", "
        )}`,
      };
    }
  }

  return { valid: true };
};

const validateDataTypes = (data) => {
  const issues = [];

  const checkObject = (obj, path = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (value === null || value === undefined) {
        issues.push(`${currentPath}: contains null/undefined value`);
      }

      if (key.toLowerCase().includes("id") && value === "") {
        issues.push(`${currentPath}: ID field cannot be empty`);
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        checkObject(value, currentPath);
      }
    });
  };

  if (Array.isArray(data)) {
    data.forEach((item, index) => checkObject(item, `[${index}]`));
  } else {
    checkObject(data);
  }

  return {
    valid: issues.length === 0,
    issues: issues,
  };
};

const validateGeneratedJSON = (data) => {
  const structureCheck = validateJSONStructure(data);
  if (!structureCheck.valid) {
    return structureCheck;
  }

  const consistencyCheck = validateArrayConsistency(data);
  if (!consistencyCheck.valid) {
    return consistencyCheck;
  }

  const dataTypeCheck = validateDataTypes(data);
  if (!dataTypeCheck.valid) {
    return {
      valid: false,
      error: "Data type validation failed",
      details: dataTypeCheck.issues,
    };
  }

  return { valid: true, message: "JSON validation passed" };
};

const validateAndParseJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    return { success: true, data: parsed };
  } catch (error) {
    return { success: false, error: "Invalid JSON format" };
  }
};

const handleAIGenerationError = (error) => {
  console.error("AI Generation Error Details:", {
    name: error.name,
    message: error.message,
    status: error.status,
    code: error.code,
  });

  if (error.status === 429) {
    return {
      status: 429,
      error: "API rate limit exceeded",
      message: "Too many requests. Please try again in a moment.",
      retryAfter: 60,
    };
  }

  if (error.status === 401) {
    return {
      status: 401,
      error: "API authentication failed",
      message: "Invalid API key or insufficient permissions.",
    };
  }

  if (error.name === "SyntaxError") {
    return {
      status: 500,
      error: "Invalid JSON generated",
      message:
        "AI generated malformed JSON. Please try again with a clearer prompt.",
    };
  }

  if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
    return {
      status: 503,
      error: "Service unavailable",
      message: "Unable to connect to AI service. Please try again later.",
    };
  }

  return {
    status: 500,
    error: "AI generation failed",
    message: "An unexpected error occurred during generation.",
  };
};

// Basic template-based JSON generation
export const generateBasicJSON = async (req, res) => {
  const { template = "user", count = 1 } = req.body;

  try {
    if (!templates[template]) {
      return res.status(400).json({
        error: "Invalid template type",
        availableTemplates: Object.keys(templates),
      });
    }

    const results = [];
    for (let i = 0; i < Math.min(count, 50); i++) {
      results.push(templates[template]());
    }

    res.json({
      success: true,
      data: count === 1 ? results[0] : results,
      template: template,
      count: results.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "JSON generation failed" });
  }
};

// Get available templates
export const getTemplates = async (req, res) => {
  try {
    const availableTemplates = Object.keys(templates).map((key) => ({
      name: key,
      sample: templates[key](),
    }));

    res.json({
      success: true,
      templates: availableTemplates,
      count: availableTemplates.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

// AI-powered JSON generation
export const generateAIJSON = async (req, res) => {
  const { prompt, count } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({
      error: "Prompt is required",
      message:
        "Please provide a description of the JSON data you want to generate.",
    });
  }

  const smartCount = determineSmartCount(prompt, count);

  if (smartCount > 100) {
    return res.status(400).json({
      error: "Count limit exceeded",
      message: "Maximum 100 records allowed per request.",
      maxAllowed: 100,
    });
  }

  try {
    const systemPrompt = `You are an expert JSON data generator for developers. 
        
        Rules:
        1. Generate realistic, structured JSON data based on user descriptions
        2. Always return an array of objects when count > 1
        3. Use appropriate data types (strings, numbers, booleans, dates)
        4. Make field names camelCase (e.g., firstName, patientId)
        5. Generate realistic sample data that developers can use for testing
        6. Include relevant fields even if not explicitly mentioned
        7. For dates, use ISO format (YYYY-MM-DD or full ISO string)
        8. For IDs, use realistic formats (e.g., USR001, PROD123)
        9. Always return valid JSON format
        
        Examples:
        - "user data" → generate objects with id, firstName, lastName, email, age, etc.
        - "product data" → generate objects with id, name, price, category, inStock, etc.
        - "healthcare data" → generate objects with patientId, name, age, diagnosis, doctor, etc.`;

    const userPrompt = `Generate ${smartCount} JSON records for: ${prompt}
        
        Return format: {"data": [array of ${smartCount} objects]}`;

    const maxRetries = 3;
    let attempt = 0;
    let lastError;

    while (attempt < maxRetries) {
      try {
        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const generatedContent = response.choices[0].message.content;
        const validation = validateAndParseJSON(generatedContent);

        if (validation.success) {
          const finalData = validation.data.data || validation.data;

          const structureValidation = validateGeneratedJSON(finalData);

          return res.json({
            success: true,
            data: finalData,
            prompt: prompt,
            count: smartCount,
            countSource: getCountSource(prompt, count),
            generatedFields:
              Array.isArray(finalData) && finalData.length > 0
                ? Object.keys(finalData[0])
                : Object.keys(finalData),
            actualCount: Array.isArray(finalData) ? finalData.length : 1,
            provider: "OpenAI API",
            validation: structureValidation.message || "Validation passed",
          });
        }

        attempt++;
        if (attempt >= maxRetries) {
          throw new Error("Failed to generate valid JSON after retries");
        }
      } catch (error) {
        lastError = error;
        if (attempt >= maxRetries - 1) {
          throw error;
        }
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  } catch (error) {
    const errorResponse = handleAIGenerationError(error);
    return res.status(errorResponse.status).json(errorResponse);
  }
};

//JSON validation endpoint
export const validateJSON = async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({
      error: "Data is required",
      message: "Please provide JSON data to validate.",
    });
  }

  try {
    const validation = validateGeneratedJSON(data);

    res.json({
      success: true,
      validation: validation,
      isValid: validation.valid,
      message: validation.valid ? "JSON is valid" : validation.error,
      details: validation.details || null,
    });
  } catch (error) {
    res.status(500).json({
      error: "Validation failed",
      message: error.message,
    });
  }
};

// Test AI connection
export const testAI = async (req, res) => {
  try {
    console.log("Testing OpenAI connection...");

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not found" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Say hello in JSON format" }],
      response_format: { type: "json_object" },
      max_tokens: 50,
    });

    res.json({
      success: true,
      message: "OpenAI API connection working",
      response: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI test error:", error);
    res.status(500).json({
      error: "OpenAI API test failed",
      details: error.message,
    });
  }
};


