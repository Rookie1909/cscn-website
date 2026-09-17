const Client = require('ssh2-sftp-client');

const sftp = new Client();

sftp.connect({
  host: process.env.FTP_HOST,
  port: 22,
  username: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
})
  .then(() => sftp.uploadDir('./dist', process.env.REMOTE_DIR))
  .then(() => {
    console.log('Upload complete');
    return sftp.end();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
