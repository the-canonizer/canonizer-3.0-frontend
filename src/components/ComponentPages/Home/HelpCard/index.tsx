import { Fragment } from "react";
import { useSelector } from "react-redux";

import styles from "./helpCard.module.scss";
import { RootState } from "../../../../store";
import Image from 'next/image'

const HelpCard = () => {
  // const { whatsNew } = useSelector((state: RootState) => ({
  //   whatsNew: state.homePage?.whatsNew,
  // }));
  const whatsNew = `
  <div class='col-1'>
   <h3>Help us bring the world together by canonizing what you believe is right.</h3>
   <div class='ratio ratio-16x9 mb-4'> <iframe width='560' height='315' src='https://player.vimeo.com/video/728133220?h=25c81d5c91' title='YouTube video player' frameborder='0' allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe> </div>
</div>
<div class='col-2'>
   <h2>What's New at Canonizer</h2>
   <p>Introducing It's <a href='/videos/consciousness'>Not a Hard Problem; It's a Color Problem,</a> the new video that outlines the emerging consensus around the <a href='/topic/88-Theories-of-Consciousness/6-Representational-Qualia'>Representational Qualia Theory</a> that is revolutionizing how we understand human consciousness.</p>
   <div class='text-center mt-3'><a href='/videos/consciousness'> <Image src='/color-problem.png' alt='consciousness'   width={500} height={500} /> </a></div>
   <p>New chapters will be added as they are completed. <a href='/videos/consciousness/'>Check it out!</a></p>
</div>
  `
  return (
    <Fragment>
      {whatsNew && (
        <section className={styles.wrap}>
          <div
            className="help-card-wrap"
            dangerouslySetInnerHTML={{ __html: whatsNew }}
          />
        </section>
      )}
    </Fragment>
  );
};

export default HelpCard;
