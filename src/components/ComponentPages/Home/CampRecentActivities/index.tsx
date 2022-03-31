import { Card, List } from 'antd';
import { BellFilled } from '@ant-design/icons';

import styles from "./campRecentActivities.module.scss";

const data = [
  {
    title: 'Rohit has made the following post to the camp Agreement forum',
  },
  {
    title: <>Vikram has just added their support to this camp:<br/> Software Development Team </>,
  },
  {
    title:<>Sunil has just removed their support from this camp :<br/> Software Development Team </> ,
  },
  {
    title:<>Reena has just added their support to this camp :<br/> Scalability Architecture /Server Ar.... </> ,
  },
  {
    title:<>Rohit had made the following post to the camp Agreement forum </> ,
  },
  {
    title:<>Vikram has just added their support to this camp :<br/> Software Development Team </> ,
  },
  {
    title:<>Sunil has just removed their support from this camp :<br/> Software Development Team </> ,
  },
  {
    title:<>Reena has just added their support to this camp :<br/> Scalability Architecture /Server Ar.... </> ,
  },
  {
    title: 'Rohit has made the following post to the camp Agreement forum',
  },
  {
    title: <>Vikram has just added their support to this camp:<br/> Software Development Team </>,
  },
  {
    title:<>Sunil has just removed their support from this camp :<br/> Software Development Team </> ,
  },
];

export default function CampRecentActivities() {
  return (
    <>
      <Card title="Recent Activities in this camp" className={"activities " + styles.campActivities} >
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item className={styles.activitiesList}>
              <List.Item.Meta 
              avatar={<BellFilled className={styles.bellIcon} />}
                title={item.title}
                description="Today 11:56"
                className={styles.listItem}
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
}
