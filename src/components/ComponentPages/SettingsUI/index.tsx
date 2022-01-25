import LayoutMaster from "../../../hoc/layout";
import { Layout, Card, Col, Row } from "antd";
import { useState } from "react";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import useAuthentication from "../../../hooks/isUserAuthenticated";
import ChangePassword from "../../../components/ComponentPages/ChangePassword"
import Image from 'next/image';
import adone from '../../../../public/images/image11.jpg';
import adtwo from '../../../../public/images/image37.jpg';
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
export default function SettingsUI() {
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
            <LayoutMaster>
                <Layout>
                    <Row className="main--layout">
                        <Col span={5}>
                            <Card>
                                <p>Create New Topic</p>
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
                                    onTab1Change(key);
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
