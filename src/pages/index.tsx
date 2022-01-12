import Head from "next/head";
import Image from "next/image";
import { Button } from "antd";
import Layout from "../hoc/layout";
import Link from "next/link";
export default function Home() {
  return (
    <Layout>
      <div>
        <Button>Hello</Button>
        <Link href="/trees">
          <a>Tress page</a>
        </Link>
        <main>
          <h1>Hello Canonizer</h1>
        </main>
        <footer>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </div>
    </Layout>
  );
}
