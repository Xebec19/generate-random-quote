import axios from "axios";
import https from "https";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const QUOTE_URL =
  "https://api.quotable.io/quotes/random?tags=inspirational&limit=100";
const WRITE_FILE = path.join(__dirname + "/assets/quotes.json");

// Create https agent that ignores SSL certificate errors (for development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function generateRandomeQuote(limit = 10, wordLimit) {
  const start = process.hrtime.bigint();
  try {
    const wordLimitFilter =
      wordLimit && !isNaN(wordLimit) && wordLimit < 100
        ? "&maxLength=" + wordLimit
        : "";

    const response = await axios.request({
      url: QUOTE_URL + wordLimit,
      httpsAgent,
    });

    const data = response.data;

    await writeFile(WRITE_FILE, JSON.stringify(data, "", 2), { flag: "w" });
  } catch (err) {
    console.error("Request failed ", err);
  } finally {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;

    console.log(`Took ${durationMs} ms`);
  }
}

generateRandomeQuote(100);
