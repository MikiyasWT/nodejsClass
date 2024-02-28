const compressImages = require('../../utils/jimp');

module.exports = async (job) => {
  const { file, fileName } = job.data;
  await compressImages(file, fileName);
};
