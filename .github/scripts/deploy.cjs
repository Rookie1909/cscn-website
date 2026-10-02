const Client = require('ssh2-sftp-client');

const MAX_ATTEMPTS = 4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// webgo.de occasionally drops the SSH handshake ("Connection lost before
// handshake"). Uploading is idempotent (files are just overwritten), so a
// failed attempt can simply be repeated from scratch with a fresh connection.
async function deployOnce() {
  const sftp = new Client();
  try {
    await sftp.connect({
      host: process.env.FTP_HOST,
      port: 22,
      username: process.env.FTP_USERNAME,
      password: process.env.FTP_PASSWORD,
      readyTimeout: 30000,
    });
    await sftp.uploadDir('./dist', process.env.REMOTE_DIR);
  } finally {
    await sftp.end().catch(() => {});
  }
}

async function main() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await deployOnce();
      console.log('Upload complete');
      return;
    } catch (err) {
      console.error(`Deploy attempt ${attempt}/${MAX_ATTEMPTS} failed:`, err.message);
      if (attempt === MAX_ATTEMPTS) throw err;
      await sleep(attempt * 10000);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
