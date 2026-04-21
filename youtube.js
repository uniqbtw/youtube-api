import axios from "axios";
import convert from "xml-js";
import { channelInfo, videoInfo, playlistInfo } from 'yt2json';
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY



// ------------------ YouTube Utils ------------------

export async function getChannelInfoMinimal(channelID) {
  const feed = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`
  );
  const result = convert.xml2json(await feed.text(), {
    compact: true,
    spaces: 2,
  });
  const json = JSON.parse(result);

  function parseYouTubeFeed(feed) {
    // ---- Данные канала ----
    const channel = {
      id: feed["yt:channelId"]?._text ?? null,
      title: feed.title?._text ?? null,
      author: feed.author?.name?._text ?? null,
      url: feed.author?.uri?._text ?? null,
      published: feed.published?._text ?? null,
    };

    // ---- Видео (entry) ----
    const entries = Array.isArray(feed.entry) ? feed.entry : [];
    const e = entries[0];

    const video = e
      ? {
          id: e["yt:videoId"]?._text ?? null,
          title: e.title?._text ?? null,
          published: e.published?._text ?? null,
          updated: e.updated?._text ?? null,
          link: e.link?._attributes?.href ?? null,
          author: e.author?.name?._text ?? null,
          thumbnail:
            e["media:group"]?.["media:thumbnail"]?._attributes?.url ?? null,
        }
      : null;

    return { channel, video };
  }

  const channelInfoBasic = parseYouTubeFeed(json.feed);
  return channelInfoBasic;
}

export async function getChannelInfoBetter(channelLink) {
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

    const video = {
      title: result.title,
      id: result.id,
      url: result.url,
      thumbnail: `https://i.ytimg.com/vi_webp/${result.id}/maxresdefault.webp`,
      duration: result.duration.lengthSec,
      views: result.views.text.split(" ")[0],
      published: {
        date: result.published.pretty,
        datetime: result.published.text
      },
      description: result.shortDescription,
      aisummary: result?.aisummary,
      keywords: result.keywords,
      category: result.category,
      maxQuality: result.stream.adaptiveFormats[0].qualityLabel,
      fps: result.stream.adaptiveFormats[0].fps,
    };

    const author = {
      id: result.channel.id,
      name: result.channel.name,
      subsribers: result.channel.subscribers.pretty.split(" ")[0],
      url: result.channel.url,
      avatar: result.channel.icons[result.channel.icons.length - 1].url,
    };

    // return(result);
    return {video, author};
  } catch (err) {
    console.log(err)
  }
}

export async function getChannelInfo(channelID) {
  const minimalInfo = await getChannelInfoMinimal(channelID);
  const moreInfo = await getChannelInfoBetter(minimalInfo.channel.url);
  const videoInfo = await getVideoInfo(minimalInfo.video.id)

  const views = (
    await axios(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelID}&key=${API_KEY}`
    )
  ).data.items[0].statistics.viewCount;

  return {
    channel: {
      id: await minimalInfo.channel.id,
      tag: await moreInfo.tag,
      name: await moreInfo.name,
      description: await moreInfo.description,
      subscribers: await moreInfo.subscribers,
      views: views,
      videos: await moreInfo.videos,
      url: await moreInfo.vanityUrl,
      avatar: await moreInfo.avatar,
      creationDate: await minimalInfo.channel.published,
    },
    lastVideo: {
      id: await minimalInfo.video.id,
      title: await minimalInfo.video.title,
      views: await videoInfo.video.views,
      duration: await videoInfo.video.duration,
      releaseDate: await minimalInfo.video.published,
      url: await minimalInfo.video.link,
      thumbnail: await videoInfo.video.thumbnail,
    },
  };
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
