import { Form, Input, Button, Tabs, Layout, Typography, Space, Card, Col, Row } from "antd";
import LayoutMaster from "../hoc/layout";
import ChangePassword from "../components/ComponentPages/ChangePassword"
import Login from "../components/componentPages/Login";
import GetStartedLayout from "../hoc/getStartedLayout";
import useAuthentication from "../hooks/isUserAuthenticated";
import { useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "../store";
const { TabPane } = Tabs;
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;
const tabList = [
    {
        key: 'profileinfo',
        tab: 'Profile Info',
    },
    {
        key: 'changepassword',
        tab: 'Change Password',
    },
];

const contentList = {
    profileinfo: <p> Profile Info</p>,
    changepassword: <p><ChangePassword></ChangePassword></p>,
};
//Route : /settings
export default function Settings() {

    const [activeTabKey, setActiveTabKey] = useState('profileinfo');

    const onTab1Change = key => {
        setActiveTabKey(key);
    };
    const { isUserAuthenticated } = useAuthentication();
    const isAuthenticate = useSelector(
        (state: RootState) => state.auth.authenticated
    );

    return (
        <>
            {isAuthenticate ?
                <LayoutMaster>
                    <Layout>
                        <Row className="main--layout">
                            <Col span={5}>
                                <Card>
                                    <p>Create New Topic</p>
                                </Card>
                                <div className="siteAds">
                                    <img src="/images/image11.jpg" alt="" />
                                </div>
                            </Col>
                            <Col span={14}>
                                <Card
                                    style={{ width: '100%' }}
                                    title="Account Settings"
                                    tabList={tabList}
                                    activeTabKey={activeTabKey}
                                    onTabChange={key => {
                                        onTab1Change(key);
                                    }}
                                    className="tab--card"
                                >
                                    {contentList[activeTabKey]}
                                </Card>
                            </Col>
                            <Col span={5}>

                                <div className="siteAds">
                                    <img src="/images/image37.jpg" alt="" />
                                </div>

                            </Col>
                        </Row>
                    </Layout>
                </LayoutMaster>
                :
                <GetStartedLayout routeName={"login"}>
                    <Card bordered={false} className="login-container">
                        <Login isModal={false} />
                    </Card>
                </GetStartedLayout>}
        </>
    );
}
