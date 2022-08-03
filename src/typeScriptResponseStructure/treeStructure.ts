export interface Node {
  topic_id: number;
  camp_id: number;
  title: number;
  review_title: string;
  link: string;
  review_link: string;
  score: number;
  submitter_nick_id: number;
  children: [Node];
}

export interface TreeStructure {
  [key: string]: Node;
}
