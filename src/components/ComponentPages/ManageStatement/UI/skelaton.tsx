import { Row, Col } from "antd";

import CustomSkelton from "components/common/customSkelton";

function ManageStatementUISkelaton({ isEdit }) {
  return (
    <Row gutter={28}>
      <Col xs={24} sm={24} xl={12}>
        <CustomSkelton
          skeltonFor="list"
          bodyCount={1}
          stylingClass="listSkeleton"
          isButton={false}
        />
      </Col>
      <Col xl={24} className="mt-9">
        <CustomSkelton
          bodyCount
          stylingClass
          isButton
          height={250}
          skeltonFor="video"
        />
      </Col>
      {isEdit && (
        <Col xl={24} className="mt-9">
          <CustomSkelton
            bodyCount
            stylingClass
            isButton
            height={250}
            skeltonFor="video"
          />
        </Col>
      )}
      <Col xl={24} className="flex justify-between items-center pt-5 mt-3">
        <div className="manage-form-btnwrap h-20 w-6/12 flex">
          <div className="h-20 w-2/12 mr-5">
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass="listSkeleton"
            />
          </div>
          <div className="h-20 w-2/12">
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass="listSkeleton"
            />
          </div>
        </div>
        <div className="h-20 w-2/12">
          <CustomSkelton
            skeltonFor="list"
            bodyCount={1}
            stylingClass="listSkeleton"
          />
        </div>
      </Col>
    </Row>
  );
}

export default ManageStatementUISkelaton;
