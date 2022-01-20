import { Form, Input, Button, Tabs ,Layout , Typography, Space} from "antd";
import LayoutMaster from "../hoc/layout";
import ChangePassword from "../components/ComponentPages/ChangePassword"

const { TabPane } = Tabs;
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;
//Route : /settings
export default function Settings() {
 
  const OperationsSlot = {
    left: <Space><Text></Text><Title level={4} >
    Account Settings
  </Title><Text></Text> </Space>
  };
  return (
    <>
    <LayoutMaster>
        <Layout>
        <Layout>
            <Sider style={{
            background:'#3ba0e9'
        }}>Advertisement</Sider>
            <Content>
                <div className="card-container">
                    <Tabs  tabBarExtraContent={OperationsSlot}>
                        <TabPane tab="Profile Info" key="1">
                            Profile Info
                        </TabPane>
                        <TabPane tab="Change Password" key="2">
                            <ChangePassword></ChangePassword>
                        </TabPane>
                    </Tabs>
                </div>
            </Content>
            <Sider
             style={{
                background:'#3ba0e9'
            }}>Advertisement</Sider>
        </Layout>
        </Layout>
    </LayoutMaster>
    </>
  );
}
