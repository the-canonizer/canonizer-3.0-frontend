import { Button, Card, Checkbox, Typography, Descriptions, List   } from "antd";
import { FileTextOutlined } from '@ant-design/icons'
import SideBar from "../Home/SideBar";
import CampTree from "./CampTree";
import styles from './CampTree/campTree.module.scss';

const { Link, Paragraph, Title } = Typography;

const CampTreeCardTitle = (
  <div>
    <h3 className="mb-0">Canonizer Sorted Camp Tree</h3> 
    <div>
      <Checkbox className={"chexkboxLabel " + styles.chexkboxLabel }>Subscribe</Checkbox>
      <Link href="#" className={styles.addNew}>
        <i className={"icon-fi-document " + styles.iconMr}/> Add News
      </Link>
    </div> 
  </div>
  );


const TopicDetails = (props) => {
  return (
    <>
      <aside className="leftSideBar">
        <SideBar />
        <Card className={'ctCard ' + styles.ctCard} title={CampTreeCardTitle}>
          <CampTree />
        </Card>
      </aside>

      <div className="pageContentWrap">
        <Card className="canCard" title={<div className="cardHeader"> <h3 className="heading-color"> <i className={"icon-fi-document " + styles.iconMr}/> News Feeds</h3></div>} 
        extra={<div className="cardActions"> <a> <i className={"icon-edit " + styles.iconMr}></i>Edit News</a> <a><i className={"icon-delete " + styles.iconMr}></i>Delete News</a></div>}>
          <Paragraph> New Video: "Consciousness: Not a Hard Problem Just a Color Problem"  </Paragraph>
          <Paragraph> Consciousness can only be apprehended in agreement with the hard sciences, and the result is very different from what most would expect  </Paragraph>
          
        </Card>
        
        <Card className="canCard" title={<div className="cardHeader"> <h3> Camp Statement </h3></div>} 
        extra={<div className="cardActions"> <span className="bold">Go live Time </span>: 5/27/2020, 8:04:24 AM </div>}
        actions={[
          <div className="card-actions-wrapper">
            <Button className="edit-btn-style">Manage/Edit Camp Statement</Button>
            <Button className="camp-btn-style">Camp Forum</Button>
          </div>
        ]}
        >
           <Title level={2} className={styles.cardHeading}>Theories of Mind and Consciousness</Title>
          <Paragraph> 

            The goal of this topic is to build and track consensus around theories of consciousness. Everyone is invited to contribute, as we want to track the default popular consensus. There is also the “Mind Expert” canonizer people can select, so people can compare the popular consensus with the “Expert Consensus”.

          </Paragraph>
          <Paragraph> We focus on bridging the <a> Explanatory Gap </a> to explore the qualitative nature of consciousness. We are asking the questions: “What are the physical properties of conscious experience?” Physical properties can be measured. “Can consciousness then be physically measured, tested, and observed?”  </Paragraph>

          <Paragraph>
             Contributors should work to describe experiments that are consistent with particular theories, and falsify competing theories.
          </Paragraph>

          <Paragraph>
             This topic is part of the <a>Consciousness Consensus Project.</a>
          </Paragraph>
          
        </Card>

        <Card className="canCard" title={<div className="cardHeader"> <h3> Current Topic Record </h3></div>} 
        actions={[
          <div className="card-actions-wrapper">
            <Button className="edit-btn-style">Manage/Edit This Topic</Button>
          </div>
        ]}
        >
          <Descriptions column={1}>
            <Descriptions.Item label="Topic Name">Theories of Consciousness</Descriptions.Item>
            <Descriptions.Item label="Namespace">/General/</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card className="canCard" title={<div className="cardHeader"> <h3> Current Camp Record </h3></div>} 
        actions={[
          <div className="card-actions-wrapper">
            <Button className="edit-btn-style">Manage/Edit This Topic</Button>
          </div>
        ]}
        >
          <Descriptions column={1}>
            <Descriptions.Item label="Camp Name"> Agreement</Descriptions.Item>
            <Descriptions.Item label="Keywords">consciousness, mind, theories </Descriptions.Item>
            <Descriptions.Item label="Camp About URL"> </Descriptions.Item>
            <Descriptions.Item label="Camp About Nick Name"> No nickname associated </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card className="canCard" title={<div className="cardHeader"> <h3> Support Tree for "Agreement" Camp </h3></div>} 
        extra={<div className="cardActions"> <i className="icon-info tooltip-icon-style"></i></div>}
        actions={[
          <div className="card-actions-wrapper">
            <Button className="support-btn-style">Directly Join or Manage Support</Button>
          </div>
        ]}
        >
          <Paragraph>
              Total Support for This Camp (including sub-camps): <span className="number-style">65.4</span>
          </Paragraph>
          <List className={"can-card-list "}>
              <List.Item>
                <a href="#">1:Rohit_Talentelgia1 <span className="number-style">1</span></a> 
              </List.Item>
              <List.Item>
                <a href="#">1:jahoward11 <span className="number-style">1</span></a> 
              </List.Item>
              <List.Item>
                <a href="#">1:Ash <span className="number-style">1</span></a> 
              </List.Item>
          </List>
          <Button type="primary" ghost className="load-more-btn"> Load More </Button>
        </Card>

      </div>
    </>
  );
};

export default TopicDetails;
