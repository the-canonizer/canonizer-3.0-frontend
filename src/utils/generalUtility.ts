import { message } from "antd";
import K from "../constants";
// import history from "./history";
// import User from "../models/user/user";

export const handleError = (error, log = false, dispatch = null) => {
  log ? console.log(error) : "";

  const nestedErrs = error
    ? error.error
      ? error.error.data
        ? error.error.data
        : ""
      : ""
    : "";

  if (
    typeof nestedErrs.error !== "string" &&
    typeof nestedErrs.error === "object" &&
    nestedErrs.error !== null &&
    nestedErrs.error
  ) {
    let keys = Object.keys(nestedErrs.error);
    keys.forEach((key) => {
      message.error(nestedErrs.error[key][0]);
    });
  } else {
    if (nestedErrs.message) {
      message.error(nestedErrs.message);
    }
    if (error.message) {
      message.error(error.message);
    }
  }
  return null;
};

export const toCamelCaseToSentence = (string) => {
  return string.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2");
};

export const capitalize = (word) => {
  return word[0].toUpperCase() + word.substring(1).toLowerCase();
};

export const snakeCaseToSentence = (string) => {
  return string
    ?.split("_")
    ?.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    ?.join(" ");
};

export const hasOnlyDigits = (string) => {
  return /^-{0,1}\d+$/.test(string);
};

export const getColor = (value) => {
  //value from 0 to 1
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",65%,70%)"].join("");
};

export const isNumberRegex = () => {
  return new RegExp("^[0-9]*$");
};

export const isDecimalRegex = () => {
  return new RegExp("^\\d+\\.?\\d*$");
};

export const isRolePresent = (roles, userRoles) => {
  let hasRole = true;
  if (roles && roles.length > 0) {
    let roleFound = false;
    for (const routeRole of roles ?? []) {
      if ([userRoles].includes(routeRole)) {
        roleFound = true;
        break;
      }
    }
    hasRole = roleFound;
  }
  return hasRole;
};
declare global {
  interface Window {
    Location: any;
  }
}
export const redirectToLogin = (error = "") => {
  if (typeof window !== "undefined") {
    // we will correct this later
    let newUrl =
      // window.location.protocol +
      // "//" +
      // K.Network.URL.Client.BaseHost +
      // ":" +
      // K.Network.URL.Client.BasePort +
      window.location.origin + "/login";
    if (error !== "") {
      newUrl += `?err=${error}`;
    }
    window.location.href = newUrl;
  }
};

export const redirectToUrl = (domainPrefix, path) => {
  // we will correct this later
  window.location.href =
    // window.location.protocol +
    // "//" +
    // (domainPrefix ? domainPrefix + "." : "") +
    // K.Network.URL.Client.BaseHost +
    // ":" +
    // K.Network.URL.Client.BasePort +
    window.location.origin + path;
};

export const setFieldErrorsFromServer = (error, form, values = undefined) => {
  if (error.error === undefined) return;
  const errors = error.error.data.errors;
  if (typeof errors === "string" || errors instanceof String) {
    return;
  }
  let fieldErrors = [];

  for (let key in errors) {
    if (errors.hasOwnProperty(key)) {
      // let fieldError = errors[key].map((error) => {
      //     return error;
      // });
      fieldErrors.push({
        name: key,
        errors: errors[key],
        value: values && values[key] ? values[key] : undefined,
      });
    }
  }
  form.setFields(fieldErrors);
};

export const snakeToCamel = (str) => {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
};

export const camelCaseKeys = (obj) =>
  Object.keys(obj).reduce(
    (ccObj, field) => ({
      ...ccObj,
      [snakeToCamel(field)]: obj[field],
    }),
    {}
  );

export const deleteQueryParam = (history, queryObj) => {
  const queryParams = new URLSearchParams(window.location.search);
  queryObj &&
    Object.keys(queryObj).map((key) => {
      queryParams.delete(key);
      history.push({
        search: queryParams.toString(),
      });
    });
};

export const getSearchedParams = () => {
  if (window.location?.search != "") {
    let obj = Object.fromEntries(new URLSearchParams(window.location?.search));
    return obj;
  }
};

export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const copyUrl = (url) => {
  const textField = document.createElement("textarea");
  textField.innerText = url;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();
  message.success("Url Copied Successfully");
};

export const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  return isJpgOrPng;
};

// Search Query Params e.g. q[name_cont]= "Name"
export const searchParams = (searchCols, values) => {
  let searchObj = {};
  searchCols.map((data) => {
    if (values && values[data.key]) {
      searchObj["q[" + [data.key] + data.type + "]"] = values[data.key];
    }
  });

  return searchObj;
};

export const setParams = (history, search, page, pageSize) => {
  // console.log("search", search);
  // if (Object.keys(search).length != 0) {
  let searchObj = { ...search, page, pageSize };
  const params = new URLSearchParams();

  Object.entries(searchObj).map(
    ([key, value]: any) => value && params.append(key, value)
  );
  history.push({ search: params.toString() });
  // }
};

export const isServer = () => {
  return typeof window === "undefined";
};
// export const handleCatchError = (errors) => {
//   let msgs = errors
//     ? errors.error
//       ? errors.error.data
//         ? errors.error.data.error
//           ? errors.error.data.error
//           : ""
//         : ""
//       : ""
//     : "";
//   if (msgs) {
//     let keys = Object.keys(msgs);
//     keys.forEach((key) => {
//       message.error(msgs[key][0]);
//     });
//   } else {
//     if (
//       errors
//         ? errors.error
//           ? errors.error.data
//             ? errors.error.data.message
//               ? errors.error.data.message
//               : ""
//             : ""
//           : ""
//         : ""
//     )
//       message.error(errors.error.data.message);
//     else {
//       message.error("Something is wrong");
//     }
//   }
// };

export const getTime = (dt) => {
  return new Date(dt * 1000).toLocaleTimeString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
