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
  {
    target: "#desktop-search-input-field",
    content:
      "This is the search bar on desktop. Type your search query and hit Enter to search.",
    disableBeacon: true, // No blinking beacon for the first step
  },
  {
    target: "#create-topic-link",
    content:
      "This is the 'Create a topic' link. Click here to create a new topic.",
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
