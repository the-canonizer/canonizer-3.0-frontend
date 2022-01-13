import React from 'react';
import { Typography, Image, } from 'antd';
import styles from "./helpCard.module.scss";


const { Title, Text, Paragraph, Link } = Typography;

const HelpCard = () => {
    return (
        <>
            <section className={styles.wrap}>
                <Title level={3}>
                    Help us bring the world together by canonizing what you believe is right.
                </Title>

                <iframe className={styles.vimeoVideo} src="https://player.vimeo.com/video/307590745?h=f878928269&title=0&byline=0&portrait=0" width="100%" height="274" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                <Title level={2}>
                    What's New at Canonizer
                </Title>

                <Paragraph className={styles.descriptionText}>
                    Introducing It's <Link>Not a Hard Problem; It's a Color Problem,</Link> the new video that outlines the emerging consensus around the <Link>Representational Qualia Theory</Link> that is revolutionizing how we understand human consciousness.
                </Paragraph>
                <div className={styles.imageWrap}>
                    <Image preview={false} src="/color-problem.png" />
                </div>
                <Paragraph className={styles.descriptionText}>
                    New chapters will be added as they are completed. <Link>Check it out!</Link>
                </Paragraph>

            </section>
        </>
    );
}

export default HelpCard;