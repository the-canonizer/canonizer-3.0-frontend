import { Breadcrumb } from "antd";
import React from "react";

function DrawerBreadcrumbs({ topicRecord, campRecord, topic_name }: any) {
  return (
    <Breadcrumb
      className="drawer-breadcrumbs ml-6"
      separator={<i className="icon-angle-right-arrow"></i>}
    >
      <Breadcrumb.Item
        href={`/topic/${topicRecord?.topic_num}-${topic_name}/1-Agreement`}
      >
        Topic: {topicRecord?.topic_name}
      </Breadcrumb.Item>
      {campRecord &&
        campRecord?.parentCamps?.map((camp, index) => (
          <React.Fragment key={index}>
            <Breadcrumb.Item
              href={`/topic/${camp?.topic_num}-${topic_name}/${camp?.camp_num}-${camp?.camp_name}`}
            >
              {camp?.camp_name}
            </Breadcrumb.Item>
          </React.Fragment>
        ))}
    </Breadcrumb>
  );
}

export default DrawerBreadcrumbs;
