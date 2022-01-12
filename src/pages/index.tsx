import Head from "next/head";
import Image from "next/image";
import { Button } from "antd";
import Layout from "../hoc/layout";
import Footer from "../components/common/footer/footer";
export default function Home() {
  return (
    <>
      <Layout>
        <div>
          <Button>Hello</Button>
          <main>
            <h1>Hello Canonizer</h1>
          </main>
        </div>
      </Layout>
      <Footer />
    </>
  );
}
