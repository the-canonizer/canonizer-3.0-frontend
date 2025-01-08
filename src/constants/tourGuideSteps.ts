export const homePageSteps: any = [
  {
    target: "#welcome-content",
    content: "This is where you’ll see a warm welcome message!",
  },
  {
    target: "#whatsnew-content",
    content: "Check out what's new in our app here.",
  },
  {
    target: "#recent-activities",
    content: "View your recent activities in this section.",
  },
  {
    target: "#featured-topic-col",
    content: "Explore the featured topics here.",
  },
  {
    target: "#prefered-topic",
    content: "Your preferred topics will be displayed here.",
    placement: "top",
  },
  {
    target: "#hot-topics",
    content: "Hot topics are displayed in this section.",
  },
];

export const searchBar: any = [
  // {
  //   title: "Welcome",
  //   content:
  //     "Welcome to Canonizer! Would you like to take a tour or skip it? You can always come back to it later.",
  //   disableBeacon: true,
  //   placement: "center",
  //   disableOverlay: true,
  // },
  {
    target: "#desktop-search-input-field",
    title: "Global Search",
    content:
      "Need to find something specific? Our global search feature allows you to explore topics, camps, statements, and nicknames effortlessly. Simply start typing and let Canonizer do the rest.",
    disableBeacon: true,
  },
  {
    target: "#create-topic-link",
    title: "Create Topic",
    content:
      "Ready to contribute to the discourse? Create your own topic and share your unique perspective with the world. This is where meaningful conversations begin, where ideas converge, and new insights emerge.",
  },
];

export const detailPageSteps = [
  {
    target: "#topic_detail_section", // ID or class of the element
    content: "This section displays the support tree for the topic.",
    placement: "top", // 'top', 'bottom', 'left', 'right'
    disableBeacon: true, // Disables the default introductory beacon
  },
  {
    target: "#topic_detail_section_heading",
    content: "Here is the heading of the Support Tree section.",
    placement: "bottom",
  },
  {
    target: "#topic_detail_section_heading_info",
    content:
      "Click this icon for additional information about the Support Tree.",
    placement: "right",
  },
  {
    target: "#topic_detail_section_heading_support_tree",
    content: "This area visualizes the support tree details.",
    placement: "left",
  },
  {
    target: "#topic_detail_section_activity_card",
    content: "This card shows recent activity related to this topic.",
    placement: "top",
  },
  {
    target: "#topic_detail_section_consesnus_tree_select_tag",
    content: "Use this dropdown to customize the consensus tree settings.",
    placement: "right",
  },
  {
    target: "#topic_detail_section_consesnus_tree_full_score_checkbox",
    content: "Enable this checkbox to view full scores for each camp.",
    placement: "right",
  },
  {
    target: "#topic_detail_section_consesnus_tree_line_break",
    content: "This line separates advanced settings from other details.",
    placement: "bottom",
  },
  {
    target: "#topic_detail_section_consesnus_tree_camp_tree",
    content: "Here is the visual representation of the camp tree.",
    placement: "top",
  },
  {
    target: "#topic_detail_section_consesnus_tree_no_camp_tree_img",
    content: "This image appears when no camps are available.",
    placement: "bottom",
  },
  {
    target: "#topic_detail_before_date",
    content: "This indicates the date when the topic was created.",
    placement: "right",
  },
  {
    target: "#topic_detail_section_activity_card",
    content: "Activity card details go here.",
    placement: "top",
  },
];

export const navBarSteps = [
  {
    target: "#menu-item-2",
    title: "Browse Topics",
    content:
      "Explore an extensive list of topics for your exploration and debate. Filter by Canon to refine your search and sort the score value or the latest date to stay updated.",
  },
  {
    target: "#menu-item-3",
    content:
      "This is the Upload File menu item. Click here to navigate to upload file.",
  },
  {
    target: "#menu-item-6",
    content: "This is the Videos menu item. Click here to navigate to videos.",
  },
  {
    target: "#menu-item-4",
    content: "This is the Help menu item. Click here to navigate to help.",
  },
  {
    target: "#menu-item-10",
    content:
      "This is the Notifications menu item. Click here to navigate to notifications.",
  },
  {
    target: "#menu-item-5",
    content:
      "This is the Settings menu item. Click here to navigate to settings.",
  },
  {
    target: "#menu-item-5",
    content:
      "This is the Supported Camps menu item. Click here to navigate to supported camps.",
  },
  {
    target: "#menu-item-19",
    content: "This is the Login menu item. Click here to navigate to login.",
  },
  {
    target: "#join-canonizer-link",
    title: "Join Canonizer",
    content:
      "Join our community by creating an account.Registration unlocks a world of possibilities, enabling you to actively participate in shaping discussions, engaging with fellow members, and contributing to something greater than yourself",
  },
];
