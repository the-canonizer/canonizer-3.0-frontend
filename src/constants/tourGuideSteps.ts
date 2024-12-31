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
    target:"#create-topic-link",
    content:"This is the 'Create a topic' link. Click here to create a new topic.",
  }
];


