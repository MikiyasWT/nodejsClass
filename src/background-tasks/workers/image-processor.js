const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');

module.exports = async (job) => {
  try {
    const { file, fileName } = job.data;
    const outputPath = path.join(__dirname, '../../../', 'uploads/', fileName);
    const imageBuffer = Buffer.from(file.buffer);
     await Jimp.read(imageBuffer)
      .then((img) => img.resize(400, 600))
      .then((img) => img.greyscale())
      .then((img) => img.quality(50))
      .then((img) => img.writeAsync(outputPath));

    console.log('Image processed and saved successfully.');
  } catch (err) {
    console.error('Error in image processing:', err);
  }
};

