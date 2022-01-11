import React from "react";
import { Row, Col, Image, Menu } from 'antd';
import styles from "./footer.module.scss";

import {
    RightOutlined,
} from '@ant-design/icons';


function Footer() {

    return (
        <>
            <section className={styles.footerbox}>
                <div className={styles.container}>
                    <Row>
                        <Col span={6}>
                            <Image
                                src="/footer-logo.svg"
                                alt="canonizer Logo"
                                width={142}
                                height={26}
                                preview={false}
                            />
                            <p>Pattent: US 8,160,970 B2</p>
                            <ul className={styles.privacy}>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms & Services</a></li>
                            </ul>
                        </Col>
                        <Col span={6}>
                            <div className={styles.FooterMenuwrap}>
                                <Menu className={styles.nav}>
                                    <Menu.Item icon={<i className="icon-angle-small-down"></i>}>
                                        browser
                                    </Menu.Item>
                                    <Menu.Item icon={<i className="icon-angle-small-down"></i>}>
                                        Create New Topic
                                    </Menu.Item>
                                    <Menu.Item icon={<i className="icon-angle-small-down"></i>}>
                                        Upload File
                                    </Menu.Item>
                                </Menu>
                            </div>
                        </Col>
                        <Col span={6}>
                            c
                        </Col>
                        <Col span={6}>
                            d
                        </Col>
                    </Row>
                    <div className={styles.copyrights}>
                        <p>Copyright owned by the volunteers contributing to the system and its contents (2006 - 2021)</p>
                    </div>
                </div>
            </section>
        </>
    );


}

export default Footer;