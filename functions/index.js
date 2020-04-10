const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const sharp = require('sharp');

admin.initializeApp();

// SSR function
const { sapper } = require('./__sapper__/build/server/server');
const app = express().use(sapper.middleware());
exports.ssr = functions.https.onRequest(app);

// Thumbnail generator
exports.thumbnailgen = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const fileName = path.basename(filePath); // Get the file name.

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return console.log(`${fileName} is not an image`);
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('opt_')) {
    return console.log(`${fileName} is already a Thumbnail.`);
  }

  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const workingDir = path.join(os.tmpdir(), 'opt');
  await fs.ensureDir(workingDir);
  const tempFilePath = path.join(workingDir, fileName);
  const metadata = {
    contentType: contentType,
  };
  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log(`Image ${fileName} downloaded locally to, tempFilePath`);

  //create new file name
  let name = fileName.split(".");
  name.pop();
  name.push('webp')
  name = name.join('.')
  let optFile = `opt_${name}`

  // convert to webp
  const tempOptPath = path.join(workingDir, optFile);
  await sharp(tempFilePath).toFile(tempOptPath);

  // save the converted image in /opt folder and upload
  const thumbFilePath = path.join(path.dirname(filePath), 'opt', optFile);
  await bucket.upload(tempOptPath, {
    destination: thumbFilePath,
    metadata: metadata,
  });

  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  return fs.remove(workingDir);
})
