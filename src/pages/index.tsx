import Head from "next/head";
import Image from "next/image";
import { Button } from "antd";
import Layout from "../hoc/layout";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Layout>
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
