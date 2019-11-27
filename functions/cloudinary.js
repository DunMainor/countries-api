const cloudinary = require('cloudinary').v2

cloudinary.config({
  secure: true,
  cloud_name: 'dunmainor',
  api_key: '123913259765398',
  api_secret: 'dVxgVW0jPmEq8Zc9VHFt0dbEumU'
})
const upload_base_64 = (base_64_image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(base_64_image.toString())
      .then(result => resolve(result))
      .catch(error => reject(error))
  })
}

const upload_url = (image_url, image_size, country_alpha_3) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image_url, { public_id: `country_flags/${image_size}/${country_alpha_3}` })
      .then(result => resolve({ url: result.url, secure_url: result.secure_url, public_id: result.public_id }))
      .catch(error => reject(error))
  })
}

module.exports = { upload_base_64, upload_url }
