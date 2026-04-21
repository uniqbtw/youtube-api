import axios from "axios";
import convert from "xml-js";
import { channelInfo, videoInfo, playlistInfo } from 'yt2json';
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY



// ------------------ YouTube Utils ------------------

export async function getChannelInfo(channelLink) {
  const query = channelLink;
  try {
    const result = await channelInfo(query);
    const jsonStr = JSON.stringify(result, null, 2); // с отступами
    //console.log(jsonStr)
    const channelData = JSON.parse(jsonStr);
    
    return channelData;
  } catch (e) {
    console.log(e);
  }

  // Подключаем функцию parseYoutubeKeywords, если она у тебя есть
}

export async function getVideoInfo(videoID) {
  const query = `https://www.youtube.com/watch?v=${videoID}`;
  try {
    const result = await videoInfo(query);
    //const result = JSON.stringify(data, null, 2); 

    return(result);
  } catch (err) {
    console.log(err)
  }
}



export async function getPlaylistInfo(playlistLink) {
const query = playlistLink

// has 100 videos
// const query = "https://www.youtube.com/playlist?list=PL8F6B0753B2CCA128";

const start = async () => {
    const result = await playlistInfo(query);
    //console.log(JSON.stringify(result, null, 4));
};

start();
}



//  import fs from "fs"

// await getChannelInfoBetter(`https://www.youtube.com/@uniqbtw/videos`)
// console.log(await getChannelInfoBetter(`https://www.youtube.com/@uniqbtw/shorts`))


// const content = await getVideoInfo(`q5O6FcQnwEw`)

// fs.writeFileSync('./videoID.json', JSON.stringify(content, null, 2), err => {
//   if (err) {

//     console.error(err);
//   } else {
    
//   }
// });
