/* istanbul ignore file */
/* eslint-disable no-console */

/**
 * Logs an info message.
 * Takes either a string or a JSON object. And prepends [INFO]: to the message.
 * If the input is a string it will be places within a JSON object in the Message property.
 */
export const info = (message: any) => {
  if (typeof message === "string") {
    console.info("[INFO]:\n" + JSON.stringify({ Message: message }, null, 4));
  } else {
    console.info("[INFO]:\n" + JSON.stringify(message, null, 4));
  }
};

/**
 * Logs a warning message.
 * Takes either a string or a JSON object. And prepends [WARNING]: to the message.
 * If the input is a string it will be places within a JSON object in the Message property.
 */
export const warn = (message: any) => {
  if (typeof message === "string") {
    console.warn(
      "[WARNING]:\n" + JSON.stringify({ Message: message }, null, 4)
    );
  } else {
    console.warn("[WARNING]:\n" + JSON.stringify(message, null, 4));
  }
};

/**
 * Logs an error message.
 * Takes either a string or a JSON object. And prepends [ERROR]: to the message.
 * If the input is a string it will be places within a JSON object in the Message property.
 */
export const error = (message: any) => {
  if (typeof message === "string") {
    console.error("[ERROR]:\n" + JSON.stringify({ Message: message }, null, 4));
  } else {
    console.error("[ERROR]:\n" + JSON.stringify(message, null, 4));
  }
};
