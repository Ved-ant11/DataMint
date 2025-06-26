import Ajv from "ajv";

const ajv = new Ajv();

// Basic JSON structure validation
export const validateJSONStructure = (data) => {
  try {
    // Check if it's valid JSON
    if (typeof data !== "object" || data === null) {
      return { valid: false, error: "Data must be a valid object" };
    }

    // Check for empty objects
    if (Object.keys(data).length === 0) {
      return { valid: false, error: "JSON cannot be empty" };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid JSON structure" };
  }
};

// Validate array of objects has consistent structure
export const validateArrayConsistency = (dataArray) => {
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

export const validateDataTypes = (data) => {
  const issues = [];

  const checkObject = (obj, path = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;

      // Check for null/undefined values
      if (value === null || value === undefined) {
        issues.push(`${currentPath}: contains null/undefined value`);
      }

      // Check for empty strings in ID fields
      if (key.toLowerCase().includes("id") && value === "") {
        issues.push(`${currentPath}: ID field cannot be empty`);
      }

      // Recursively check nested objects
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

// Main validation function
export const validateGeneratedJSON = (data) => {
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
