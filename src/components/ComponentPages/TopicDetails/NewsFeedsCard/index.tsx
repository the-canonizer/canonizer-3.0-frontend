import { Card, Typography  } from "antd";
import styles from '../campTree.module.scss';

const { Paragraph } = Typography;


const NewsFeedsCard = () => {
    return (
        <Card className="canCard" title={<div className="cardHeader"> <h3 className="heading-color"><i className={"icon-fi-document " + styles.iconMr}/>News Feeds</h3></div>} 
        extra={<div className="cardActions"> <a><i className={"icon-edit " + styles.iconMr}></i>Edit News</a> <a><i className={"icon-delete " + styles.iconMr}></i>Delete News</a></div>}>
          <Paragraph> New Video: "Consciousness: Not a Hard Problem Just a Color Problem"  </Paragraph>
          <Paragraph> Consciousness can only be apprehended in agreement with the hard sciences, and the result is very different from what most would expect  </Paragraph>
          
        </Card>
    );
}
export default NewsFeedsCard;