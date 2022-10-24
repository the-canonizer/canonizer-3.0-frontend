import React, { ReactElement } from 'react'
import styles from './style.module.scss'

interface Props {
    
}

export default function CanonVideos({}: Props): ReactElement {
    return (
        <div className={styles.videosLayout} >
            <div className={styles.sideBar}>
                Sidebar
            </div>
            <div className={styles.videosContainer}>
                videos
            </div>
        </div>
    )
}
