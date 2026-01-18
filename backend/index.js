import express from "express";
import fetch from "node-fetch";
import UAParser from "ua-parser-js";

const app = express();

app.get("/", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const userAgent = req.headers["user-agent"];
  const parser = new UAParser(userAgent);
  const ua = parser.getResult();

  let geo = {};
  try {
    const r = await fetch(`https://ipapi.co/${ip}/json/`);
    geo = await r.json();
  } catch {}

  const data = {
    time: new Date().toISOString(),
    country: geo.country_name,
    city: geo.city,
    device: ua.device.type || "desktop",
    brand: ua.device.vendor || "unknown",
    browser: ua.browser.name,
    os: ua.os.name,
    referrer: req.headers.referer || "direct"
  };

  console.log("NEW VISIT:", data);

  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server running");
});
