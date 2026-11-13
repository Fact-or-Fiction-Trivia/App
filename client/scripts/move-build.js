// Moves the CRA build output into ../server/build for the Express server.
// Skipped on Netlify, which publishes client/build directly.
const fs = require("fs");
const path = require("path");

if (process.env.NETLIFY) {
  console.log("Running on Netlify: leaving build output in client/build");
  process.exit(0);
}

const src = path.join(__dirname, "..", "build");
const dest = path.join(__dirname, "..", "..", "server", "build");

fs.rmSync(dest, { recursive: true, force: true });
fs.renameSync(src, dest);
console.log(`Moved build output to ${dest}`);
