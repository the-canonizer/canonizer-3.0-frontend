// import "./globals.css";
import * as React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import Layout from "src/hoc/layout/layoutApp";
import { Providers } from ".././store/provider";

import "antd/dist/antd.css";
import "react-quill/dist/quill.snow.css";

import "../../styles/globals.scss";
import "../../styles/variables.less";
import "../assets/fonticons/style.css";
import "../assets/scss/global.scss";
import { metaTagsApi } from 'src/network/api/metaTagsAPI';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(currentPath: any) {
 

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiOGM3YzhjZmYwMGUwODkzZDgzY2NjYTZiODJkMzJjNzNkMGVhNDg3ODA2ODcxMTAyMjcxZmNiOWRiOTdjNDAzMDc2MTU1MzA4MDMzY2E5MGEiLCJpYXQiOjE2ODQ4NTA3NzMuMjM4MDAzLCJuYmYiOjE2ODQ4NTA3NzMuMjM4MDA5LCJleHAiOjE3MTY0NzMxNzMuMjM0MjIyLCJzdWIiOiIiLCJzY29wZXMiOlsiKiJdfQ.LghBuYGOanAx5gpGmjlgPfMPMiTRoV-f2yzmONWRLxGbX6TqREbEJaFhj9u-rprpeqhvDV0W288fDLFdBfC3O-BYUUvdghpYJHaUZxAdfGsoll8Rybkq5VYXEyCjjl_D8Wud5W2aoifQ0fBc1OXEjZod-rf1NCfFR2Vg9ly-J_EwjdnBVsH7MYpwulXQYXz7WD4iMBriD35YhggRDLW80azqrLEqi_HOnmYH-o0Lu8Glc170h2MNo7yLbAp2x0_6of7h7JZIR4FVnLC7BPXJXV699vM1i3gXgKjHAVdowBoDI7Xhml9c7xThGrbACZwhGDT6mJzY1y7QloZKRP1HUM-nfn33Tyawq6MGqmvoH0jQy34vmMBp6Qp5myI2JiUk4fGVGfXhbTQUnIx8D6ppeyXJdiDeJNmOdDA1D8XMGyTfgTuj7T714now0ImPShOkoOwwhnmEFFL360bRWk0bKW4Puvc0Vq2f6DXaQHohsQQMmePb7ogSLVC6z4mU4cRqakcj-GlnDrBG6HMk6PU8s2gA1BAW0TXnVf1AnQVLmxBJPmf6INnwdwMKM_TChOQrDxYreJ4hZ8Rc6HxuJeBBhXuejHuWbe2cUWqDGCRpT0T_4W8Jet_EA0UFOrvGttIbN4ZlSol4suva6z-dSbwk2PXgFDLNvzg6FBW07dw7IfM");

  var raw = JSON.stringify({
    "page_name": "home",
    "keys": {
      "topic_num": 904,
      "camp_num": 1,
      "forum_num": 93
    }
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const responseMeta: any = await fetch("http://codedistrictem.com:7020/api/v3/meta-tags", requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

  return {
    title: `${responseMeta?.data?.title} | OK`,
    description: responseMeta?.data?.description,
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  };
}

interface LayoutProps {
  children: any;
  context: string;
}

const RootLayout: React.FC<LayoutProps> = ({ children, context }) => {
  const metadata = generateMetadata( children?.props?.childProp?.segment); // Generate metadata based on the provided context

  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
