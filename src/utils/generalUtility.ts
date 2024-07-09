import { message } from "antd";
import moment from "moment";

export const handleError = (error, log = false) => {
  log ? window.console.log(error) : "";

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
export const formatTheDate = (date, formatString) => {
  return moment.utc(date).format(formatString);
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
// declare global {
//   interface Window {
//     Location: any;
//   }
// }
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
    if (errors.Object.prototype.hasOwnProperty.call(key)) {
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
  let searchObj = { ...search, page, pageSize };
  const params = new URLSearchParams();

  Object.entries(searchObj).map(
    ([key, value]: any) => value && params.append(key, value)
  );
  history.push({ search: params.toString() });
};

export const isServer = () => {
  return typeof window === "undefined";
};

export const getTime = (dt) => {
  return new Date(dt * 1000).toLocaleTimeString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const routeToUserPage = (
  router,
  topicnum = "",
  campnum = "",
  canon = 1
) => {
  return router?.push({
    pathname: `/user/supports`,
    query: {
      topicnum,
      campnum,
      canon,
      camp: `camp_${topicnum}_${campnum}`,
    },
  });
};

export const replaceSpecialCharacters = (url: string, character: string) => {
  return url
    ?.replace(/[^a-zA-Z0-9]/g, character)
    ?.split(character)
    ?.filter((item) => item !== "")
    ?.join(character);
};

export const showCreateCampButton = (camp: {
  is_disabled: number;
  parent_camp_is_one_level: number;
  parent_camp_is_disabled: number;
  is_one_level: number;
}) => {
  if (camp?.is_disabled === 1) {
    return camp?.parent_camp_is_one_level === 1
      ? false
      : camp?.parent_camp_is_disabled === 1
      ? false
      : false;
  } else if (camp?.is_disabled === 0) {
    return camp?.parent_camp_is_disabled === 1
      ? false
      : camp?.parent_camp_is_disabled == undefined
      ? true
      : camp?.parent_camp_is_one_level === 1
      ? false
      : camp?.parent_camp_is_one_level == undefined
      ? true
      : true;
  }
};

export const disableInput = (camp: {
  is_disabled: number;
  parent_camp_is_one_level: number;
  parent_camp_is_disabled: number;
  is_one_level: number;
}) => {
  if (camp?.is_disabled === 1) {
    return true;
  } else if (camp?.is_disabled === 0) {
    return camp?.parent_camp_is_disabled === 1
      ? true
      : camp?.parent_camp_is_disabled == undefined
      ? false
      : camp?.parent_camp_is_one_level === 1
      ? true
      : camp?.parent_camp_is_one_level == undefined
      ? false
      : false;
  }
};

export const emojiValidation =
  (exp) =>
  ({ setFieldValue }) => ({
    validator(currentField, value) {
      if (value && !value?.trim().match(exp)) {
        return Promise.resolve();
      } else if (value && value.length > 0 && value?.trim().match(exp)) {
        setFieldValue(currentField.field, value.replace(exp, "")?.trim());
        return Promise.resolve();
      }
      return Promise.resolve();
    },
  });

export const allowedEmojies =
  () =>
  ({ setFieldValue }) => ({
    validator(currentField, value) {
      const emojies = process.env.NEXT_PUBLIC_NOT_ALLOWED_EMOJIS?.split(",");
      if (value) {
        if (Array.isArray(emojies) && emojies.length) {
          for (let i = 0; i < emojies.length; i++) {
            const em = emojies[i];
            if (value.includes(em)) {
              setFieldValue(
                currentField.field,
                value.replace(new RegExp(em, "g"), "")
              );
            }
          }
          return Promise.resolve();
        }
      }
      return Promise.resolve();
    },
  });

export const changeSlashToArrow = (label: string) => {
  let removednamespace = label?.replace(/^\/|\/$/g, "");
  removednamespace = removednamespace?.replace(/\//g, " > ");
  return removednamespace;
};

export const getCookies = function () {
  if (typeof window !== "undefined") {
    var pairs = document?.cookie?.split(";");
    var cookies = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
    }
    return cookies;
  }
};

export const getProperties = (item) => {
  if (item?.log_name === "support") {
    const parsedData = JSON.parse(item?.properties);
    return parsedData;
  }

  return null;
};

export function parseCookies(cookiesString) {
  const cookiesArray = cookiesString?.split('; ');
  const cookiesObject = {};
  
  cookiesArray?.forEach(cookie => {
    const [key, value] = cookie?.split('=');
    cookiesObject[key] = value;
  });
  
  return cookiesObject;
  }

export const capitalizeFirstLetter = (str) => str?.charAt(0)?.toUpperCase() + str?.slice(1);

 
