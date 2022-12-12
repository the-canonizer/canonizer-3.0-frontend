// import React from 'react';

// // This imports the functional component from the previous sample.
// import VideoJS from './../components/videoJs'
import { useEffect } from 'react';
import videojs from 'video.js';
// const Test = () => {
//   const playerRef = React.useRef(null);

//   const videoJsOptions = {
//     autoplay: true,
//     controls: true,
//     responsive: true,
//     fluid: true,
//     sources: [{
//     //   src: '/path/to/video.mp4',
//       src:'https://canonizer3.canonizer.com/static/videos/consciousness/perceiving_a_strawberry_360.mp4',
//       type: 'video/mp4'
      
//     }]
//   };

//   const handlePlayerReady = (player) => {
//     playerRef.current = player;

//     // You can handle player events here, for example:
//     player.on('waiting', () => {
//       videojs.log('player is waiting');
//     });
//     player.textTracks()

//     player.on('dispose', () => {
//       videojs.log('player will dispose');
//     });
//   };

//   return (
//     <>
//       <div>Rest of app here</div>
//       <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
//       <div>Rest of app here</div>
//     </>
//   );
// }


 
// export default Test;




const Test = () => {

useEffect(() => {
    
    
        var player = videojs('content_video');
    
    player.on('ready', function() {
      player.vhs = null;
      
    });
}, []);



    return (
          <body>
    <div className='container'>
      <video id="content_video" className="video-js vjs-default-skin vjs-16-9" controls preload="auto" width="640" height="360">
        <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
        <track label="English" kind="chapters" srcLang="en" src="https://kot-politiken.s3-eu-west-1.amazonaws.com/2019/114_en.vtt.txt" default />
      </video>
    </div>
  </body>
      );
}
 
export default Test;