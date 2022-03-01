import { Button, Card, Checkbox, Typography  } from "antd";
import { FileTextOutlined } from '@ant-design/icons'
import SideBar from "../Home/SideBar";
import CampTree from "./CampTree";
import styles from './CampTree/campTree.module.scss';

const { Link } = Typography;

const CTCHeader = (
  <div>
    <h3 className="mb-0">Canonizer Sorted Camp Tree</h3> 
    <div>
      <Checkbox className={"ChexkboxLabel " + styles.ChexkboxLabel }>Subscribe</Checkbox>
      <Link href="#" className={styles.AddNew}>
        <i className={"icon-fi-document " + styles.IconMr}/> Add News
      </Link>
    </div> 
  </div>
  );

const TopicDetails = (props) => {
  return (
    <>
      <aside className="leftSideBar">
        <SideBar />
        <Card className={'CTcard ' + styles.CTcard} title={CTCHeader}>
          <CampTree />
        </Card>
        
      </aside>
      <div className="pageContentWrap">
        <Card title={<div className=""> <h3> <i className={"icon-fi-document " + styles.IconMr}/> News Feeds</h3></div>} 
        extra={<div className="CardActions"> <Button>Edit News</Button> <Button>Delete News</Button></div>}>

        </Card>
      </div>
    </>
  );
};

export default TopicDetails;
