import { Row, Col } from "antd";

import CustomSkelton from "components/common/customSkelton";

function ManageStatementUISkelaton({ isEdit }) {
  return (
    <Row gutter={28}>
      <Col xs={24} sm={24} xl={12} key="col-1">
        <CustomSkelton
          skeltonFor="list"
          bodyCount={1}
          stylingClass="listSkeleton"
          isButton={false}
          key="customSkelton-1"
        />
      </Col>
      <Col xl={24} className="mt-9" key="col-2">
        <CustomSkelton
          bodyCount
          stylingClass
          isButton
          height={250}
          skeltonFor="video"
          key="customSkelton-2"
        />
      </Col>
      {isEdit && (
        <Col xl={24} className="mt-9" key="col-3">
          <CustomSkelton
            bodyCount
            stylingClass
            isButton
            height={250}
            skeltonFor="video"
            key="customSkelton-3"
          />
        </Col>
      )}
      <Col
        xl={24}
        className="flex justify-between items-center pt-5 mt-3"
        key="col-4"
      >
        <div className="manage-form-btnwrap h-20 w-6/12 flex" key="div-1">
          <div className="h-20 w-2/12 mr-5" key="div-2">
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass="listSkeleton"
              key="customSkelton-4"
            />
          </div>
          <div className="h-20 w-2/12" key="div-3">
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass="listSkeleton"
              key="customSkelton-5"
            />
          </div>
        </div>
        <div className="h-20 w-2/12" key="div-4">
          <CustomSkelton
            skeltonFor="list"
            bodyCount={1}
            stylingClass="listSkeleton"
            key="customSkelton-6"
          />
        </div>
      </Col>
    </Row>
  );
}

export default ManageStatementUISkelaton;
