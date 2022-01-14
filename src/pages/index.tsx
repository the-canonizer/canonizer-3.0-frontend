import Head from "next/head";
import Image from "next/image";
import { Button, Row, Col } from "antd";
import Layout from "../hoc/layout";
import Link from "next/link";

import SideBar from '../components/ComponentPages/home/sideBar';
import TopicsList from '../components/ComponentPages/home/topicsList';
import HelpCard from "../components/ComponentPages/home/helpCard";
import RecentActivities from "../components/ComponentPages/home/recentActivities";


export default function Home() {
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
          <Row gutter={16}>
            <Col xs={24} sm={24} xl={12}>
              <TopicsList />
            </Col>
            <Col xs={24} sm={24} xl={12}>
              <RecentActivities />
            </Col>
            <Col xs={24} sm={24} xl={24}>
              <HelpCard />
            </Col>
          </Row>
          <div>
            <Button>Hello</Button>
            <Link href="/trees">
              <a>Tress page</a>
            </Link>
            <main>
              <h1>Hello Canonizer</h1>
            </main>
          </div>
        </div>
      </Layout>
    </>
  );
}
