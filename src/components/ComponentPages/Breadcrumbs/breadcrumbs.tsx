import { Breadcrumb, Button } from "antd";
// import "./breadcrumbs.scss";

import { HomeOutlined } from "@ant-design/icons";

function Breadcrumbs() {
  return (
    <>
      <div className="max-md:mx-[-1rem] max-md:shadow-[0px_10px_10px_0px_#0000001A] md:bg-[#F4F5FAB2] p-[1.5rem] md:rounded-[1.25rem] flex items-center justify-between gap-2 ">
        <Breadcrumb
          className="cn-breadcrumbs"
          separator={
            <>
              <i className="icon-angle-right"></i>
            </>
          }
        >
          <Breadcrumb.Item href="">
            <i className="icon-home"></i>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">(Canon) General</Breadcrumb.Item>
          <Breadcrumb.Item href="">
            Topic: Representationalist Books
          </Breadcrumb.Item>
          <Breadcrumb.Item>Topic History</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          size="large"
          type="primary"
          className="flex items-center justify-center rounded-[10px] max-lg:hidden gap-3.5 leading-none"
        >
          Update Current Statement
          <i className="icon-edit"></i>
        </Button>
      </div>
    </>
  );
}

export default Breadcrumbs;
