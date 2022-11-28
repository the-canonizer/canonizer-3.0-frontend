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
    title: "Canonizer",
    description: "Short description ",
    route: "/",
    image_url:'https://canonizer3.canonizer.com/color-problem.png'
  },
  AboutUsPage: {
    title: "Canonizer",
    description: "Short description ",
    route: "about",
  },
  TreesPage: {
    title: "Canonizer",
    description: "Short description ",
    route: "trees",
  },
  ForgotPasswordPage: {
    title: "Canonizer",
    description: "forgot canonizer login password ",
    route: "forgot-password",
  },
  LoginPage: {
    title: "Canonizer",
    description: "login canonizer ",
    route: "login",
  },
  RegistrationPage: {
    title: "Canonizer",
    description: "Register to canonizer ",
    route: "registration",
  },
  ResetPasswordPage: {
    title: "Canonizer",
    description: "Reset canonizer login password ",
    route: "reset-password",
  },
  Settings: {
    title: "Canonizer",
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
