import Head from "next/head";
import Image from "next/image";
import { Button, Row, Col } from "antd";
import Layout from "../hoc/layout";
import Link from "next/link";

import TopicsList from '../components/ComponentPages/topicsList';
import HelpCard from "../components/ComponentPages/helpCard";

export default function Home() {
  return (
    <>
      <Layout>
        <Row gutter={16}>
          <Col xs={24} md={12} lg={12}>
            <TopicsList />
          </Col>
          <Col xs={24} md={12} lg={12}>
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
      </Layout>
    </>
  );
}
