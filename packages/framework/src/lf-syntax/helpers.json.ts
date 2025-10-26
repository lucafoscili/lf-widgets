import { LfSyntaxUnescapeJSONPayload } from "@lf-widgets/foundations";

//#region areJSONEqual
/**
 * Compares two values for equality by converting them to JSON strings.
 * Note: This method may not handle all edge cases (e.g., functions, undefined, or circular references).
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns True if the JSON string representations are equal, false otherwise.
 */
export const areJSONEqual = (a: unknown, b: unknown) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
//#endregion

//#region isJSONLikeString
/**
 * Checks if the provided value is a string that resembles a JSON object or array.
 * This function performs a basic heuristic check to determine if the string could be valid JSON,
 * including empty objects/arrays, objects with key-value pairs, arrays of simple scalars,
 * or strings containing quotes (indicating potential JSON content).
 * Note: This is not a full JSON parser and may return true for invalid JSON strings.
 *
 * @param value - The value to check, which can be of any type.
 * @returns `true` if the value is a string that looks like JSON (object or array); otherwise, `false`.
 *          This acts as a type guard, narrowing the type to `string` when `true`.
 */
export const isJSONLikeString = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (
    !(
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    )
  ) {
    return false;
  }

  if (trimmed.startsWith("{")) {
    if (trimmed === "{}") return true;
    if (/".*"\s*:\s*.+/.test(trimmed)) return true;
    return false;
  }

  if (trimmed.indexOf('"') !== -1) return true;

  const simpleArrayScalar =
    /^\[\s*(?:-?\d+(\.\d+)?|true|false|null)(\s*,\s*(?:-?\d+(\.\d+)?|true|false|null))*\s*\]$/i;
  if (trimmed.startsWith("[") && simpleArrayScalar.test(trimmed)) return true;

  return false;
};
//#endregion

//#region isValidJSON
/**
 * Checks if the given value can be serialized to JSON.
 * @param value - The value to check for JSON serializability.
 * @returns True if the value can be JSON stringified, false otherwise.
 */
export const isValidJSON = (value: unknown) => {
  try {
    JSON.stringify(value);
    return true;
  } catch (error) {
    return false;
  }
};
//#endregion

//#region parseJson
/**
 * Parses the JSON from a Response object.
 * @template T - The expected type of the parsed JSON.
 * @param response - The Response object to parse.
 * @returns The parsed JSON as type T or Record<string, unknown>, or null if parsing fails.
 */
export const parseJson = async <T>(response: Response) => {
  try {
    return (await response.json()) as T | Record<string, unknown>;
  } catch {
    return null;
  }
};
//#endregion

//#region unescapeJson
/**
 * Unescapes and parses JSON input, handling nested JSON structures recursively.
 * Attempts to parse the input as JSON, and if successful, deeply parses any nested JSON-like strings.
 * If parsing fails, it falls back to recursive unescaping of the input string.
 *
 * @param input - The input to unescape and parse, can be a string, object, or any type.
 * @returns An object containing:
 *   - `isValidJSON`: Boolean indicating if the input was successfully parsed as JSON.
 *   - `unescapedString`: The unescaped string representation of the parsed data.
 *   - `parsedJSON`: The parsed JSON object, or undefined if parsing failed.
 */
export const unescapeJson = (input: any): LfSyntaxUnescapeJSONPayload => {
  let isValidJSON = false;
  let parsedJSON: Record<string, unknown> | undefined = undefined;
  let unescapedString = input;

  const recursiveUnescape = (inputStr: string): string => {
    let newStr = inputStr.replace(/\\(.)/g, "$1");
    while (newStr !== inputStr) {
      inputStr = newStr;
      newStr = inputStr.replace(/\\(.)/g, "$1");
    }
    return newStr;
  };

  const deepParse = (data: unknown) => {
    if (isJSONLikeString(data)) {
      try {
        const innerJson = JSON.parse(data);
        if (typeof innerJson === "object" && innerJson !== null) {
          return deepParse(innerJson);
        }
      } catch (e) {
        return data;
      }
    } else if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;
      Object.keys(obj).forEach((key) => {
        obj[key] = deepParse(obj[key]);
      });
    }
    return data;
  };

  try {
    parsedJSON = isJSONLikeString(input) ? JSON.parse(input) : input;
    isValidJSON = true;
    parsedJSON = deepParse(parsedJSON) as Record<string, unknown>;
    unescapedString = JSON.stringify(parsedJSON, null, 2);
  } catch (error) {
    if (typeof input === "object" && input !== null) {
      try {
        unescapedString = JSON.stringify(input, null, 2);
        isValidJSON = true;
        parsedJSON = input;
      } catch (stringifyError) {
        unescapedString = recursiveUnescape(input.toString());
      }
    } else {
      unescapedString = recursiveUnescape(input.toString());
    }
  }

  return {
    isValidJSON,
    unescapedString,
    parsedJSON,
  };
};
//#endregion
