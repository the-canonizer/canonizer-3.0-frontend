export default {
  Home: `{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Canonizer",
    "url": "https://canonizer.com/",
    "logo": "https://canonizer-public-file.s3.us-east-2.amazonaws.com/site-images/logo.svg"
  }`,
  VideosPage: `{
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Videos | Canonizer",
    "description": "Canonizer videos on Consciousness: Not a Hard Problem, Just a Color Problem",
    "thumbnailUrl": "https://imgur.com/a/X8WgRBg",
    "uploadDate": "",
    "embedUrl": "https://canonizer.com/static/videos/consciousness/introduction_360.mp4",
    "potentialAction": {
      "@type": "SeekToAction",
      "target": "https://canonizer.com/static/videos/consciousness/introduction_360.mp4={seek_to_second_number}",
      "startOffset-input": "required name=seek_to_second_number"
    }
  }`,
  CreateNewTopicPage: `{
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Canonizer Topics",
    "url": "https://canonizer.com/create/topic",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://canonizer.com/create/topic{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }`,
  BrowsePage: `{
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Browse Topics - Canonizer",
    "url": "https://canonizer.com/browse",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.google.com/search?sitesearch=canonizer.com&q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }`,
  TopicDetailsPage: `{
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Theories of ConsciousnessTopics",
    "url": "https://canonizer.com/topic/88-Theories-of-Consciousness/1-Agreement",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }`,
  StatementHistoryPage: `{
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Canonizer Statement",
    "url": "https://canonizer.com/statement/history/88-Theories-of-Consciousness/1-Agreement",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }`,
  CampForumListPage: `{
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Canonizer Camp Forum",
    "url": "https://canonizer.com/forum/88-Theories-of-Consciousness/1-Agreement/threads",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }`,
};
