import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { channelId } = req.query;

    const URL = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`;

    try {
      const { data } = await axios.get(URL);
      const list = data.items;

      if (!list) throw new Error("invalid_id");

      const channelData = {
        id: list[0].id,
        title: list[0].snippet.title,
        thumbnail: list[0].snippet.thumbnails.default,
        url: `https://www.youtube.com/channel/${list[0].id}`,
        videoCount: list[0].statistics.videoCount,
      };

      res.status(200).json(channelData);
    } catch (error) {
      if (error.message === "invalid_id") {
        res.status(404).json({ code: error.message });
      } else {
        res.status(400).json({ code: "unknown" });
      }
    }
  }
}
