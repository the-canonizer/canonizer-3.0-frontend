import CanonVideos from '@/components/ComponentPages/canonVideos'
import Layout from "src/hoc/layout";
import React from 'react'

function Video() {
    return (
        <Layout>
            <CanonVideos />
        </Layout>
    )
}
Video.displayName = "VideosPage";
export default Video