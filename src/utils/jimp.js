const path = require('path');
const Jimp = require('jimp');
const logger = require('../config/logger');

const compressImages = async (file, fileName) => {
  try {
    const outputPath = path.join(__dirname, '../../', 'uploads/', fileName);
    const imageBuffer = Buffer.from(file.buffer);
    await Jimp.read(imageBuffer)
      .then((img) => img.resize(400, 600))
      .then((img) => img.greyscale())
      .then((img) => img.quality(50))
      .then((img) => img.writeAsync(outputPath));

    logger.info('Image processed and saved successfully.');
  } catch (err) {
    logger.error('Error in image processing:', err);
  }
};

module.exports = compressImages;
