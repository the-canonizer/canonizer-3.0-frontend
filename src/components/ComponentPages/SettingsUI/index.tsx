import { useState } from "react";
import { Layout, Card, Col, Row, Button } from "antd";
import Icon from "@ant-design/icons";
import Image from 'next/image';
import LayoutMaster from "../../../hoc/layout";
import ChangePassword from "../../../components/ComponentPages/ChangePassword"
import adone from '../../../../public/images/image11.jpg';
import adtwo from '../../../../public/images/image37.jpg';
import createTopic from '../../../../public/images/topic-icn.svg';
import ProfileInfo from "../ProfileInfo";

const tabList = [
    {
        key: 'profile_info',
        tab: 'Profile Info',
    },
    {
        key: 'change_password',
        tab: 'Change Password',
    },
];

const contentList = {
    profile_info: <p><ProfileInfo /> </p>,
    change_password: <p><ChangePassword /></p>,
};

export default function SettingsUI() {
    const [activeTabKey, setActiveTabKey] = useState('profile_info');
    const onTabChange = key => {
        setActiveTabKey(key);
    };

    return (
        <>
            <LayoutMaster>
                <Layout>
                    <Row className="main--layout">
                        <Col span={5}>
                            <Card>
                                <Button size="large" className="createTopicBtn">
                                    <Icon component={() => (<Image alt="adOne" src={createTopic} />)} />
                                    Create New Topic
                                </Button>
                            </Card>
                            <div className="siteAds">
                                <Image alt="adOne" src={adone} />
                            </div>
                        </Col>
                        <Col span={14}>
                            <Card
                                style={{ width: '100%' }}
                                title="Account Settings"
                                tabList={tabList}
                                activeTabKey={activeTabKey}
                                onTabChange={key => {
                                    onTabChange(key);
                                }}
                                className="tab--card"
                            >
                                {contentList[activeTabKey]}
                            </Card>
                        </Col>
                        <Col span={5}>
                            <div className="siteAds">
                                <Image alt="adtwo" src={adtwo} />
                            </div>
                        </Col>
                    </Row>
                </Layout>
            </LayoutMaster>
        </>
    );
}
