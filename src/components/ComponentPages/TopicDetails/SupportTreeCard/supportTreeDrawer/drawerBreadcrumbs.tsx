import { EllipsisOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React, { useState } from "react";

function DrawerBreadcrumbs({ topicRecord, campRecord, topic_name }: any) {
  const [showAll, setShowAll] = useState(false);
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
      {campRecord && campRecord?.parentCamps?.length > 1 && !showAll ? (
        <>
          <Breadcrumb.Item>
            <button onClick={() => setShowAll(true)}>
              <EllipsisOutlined />
            </button>
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/topic/${topicRecord?.topic_num}-${topic_name}/${campRecord?.camp_num}-${campRecord?.camp_name}`}>
          Camp: {campRecord?.camp_name}
          </Breadcrumb.Item>
        </>
      ) : (
        campRecord?.parentCamps?.map((camp, index) => (
          <React.Fragment key={index}>
            <Breadcrumb.Item
              href={`/topic/${camp?.topic_num}-${topic_name}/${camp?.camp_num}-${camp?.camp_name}`}
            >
              {camp?.camp_name}
            </Breadcrumb.Item>
          </React.Fragment>
        ))
      )}
    </Breadcrumb>
  );
}

export default DrawerBreadcrumbs;
