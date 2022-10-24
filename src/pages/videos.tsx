import Layout from "../hoc/layout";
import React, { ReactElement } from 'react'
import CanonVideos from "@/components/ComponentPages/canonVideos";

interface Props {
    
}

export default function VideosPage({}: Props): ReactElement {
    return (
        <Layout>
            <CanonVideos/>
        </Layout>
    )
}
