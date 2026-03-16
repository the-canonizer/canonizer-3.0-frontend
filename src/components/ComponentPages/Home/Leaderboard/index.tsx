import { Avatar, List, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

import styles from "./Leaderboard.module.scss";

const { Title } = Typography;

const MOCK_LEADERS = [
  { id: 1, nickname: "ConsensusBuilder", activities: 142 },
  { id: 2, nickname: "MindMapper", activities: 118 },
  { id: 3, nickname: "TruthSeeker42", activities: 97 },
  { id: 4, nickname: "DialecticPro", activities: 84 },
  { id: 5, nickname: "OpenDebater", activities: 71 },
];

const Leaderboard = () => {
  return (
    <div className={styles.wrapper} data-testid="leaderboard">
      <Title level={4} className={styles.sectionTitle}>
        Most Active This Week
      </Title>
      <List
        dataSource={MOCK_LEADERS}
        renderItem={(item, index) => (
          <List.Item className={styles.listItem}>
            <div className={styles.itemContent}>
              <span className={styles.rankNumber}>{index + 1}</span>
              <Avatar size={36} icon={<UserOutlined />} />
              <span className={styles.nickname}>{item.nickname}</span>
              <span className={styles.activityCount}>
                {item.activities} actions
              </span>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Leaderboard;
