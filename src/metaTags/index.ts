type tagtypes = {
  title: string;
  description: string;
  route: string;
  image_url?: string;
};

type MetaTagsTypes = {
  [key: string]: tagtypes;
};

const MetaTags: MetaTagsTypes = {
  Home: {
    title: "About Landing Page",
    description: "Short description ",
    route: "/",
  },
  AboutUsPage: {
    title: "About Canonizer",
    description: "Short description ",
    route: "about",
  },
  TreesPage: {
    title: "About Canonizer Trees",
    description: "Short description ",
    route: "trees",
  },
  ForgotPasswordPage: {
    title: "forgot password",
    description: "forgot canonizer login password ",
    route: "forgot-password",
  },
  LoginPage: {
    title: "login",
    description: "login canonizer ",
    route: "login",
  },
  RegistrationPage: {
    title: "Registration",
    description: "Register to canonizer ",
    route: "registration",
  },
  ResetPasswordPage: {
    title: "Reset Password",
    description: "Reset canonizer login password ",
    route: "reset-password",
  },
  Settings: {
    title: "Account Settings",
    description: "Account Settings",
    route: "settings",
  },
  default: {
    title: "Canonizer",
    description: "Default short description for canonizer app",
    route: "/",
  },
};

export default MetaTags;
