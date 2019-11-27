/* eslint-disable no-return-assign */
const fs = require('fs')

const cloudinary = require('./functions/cloudinary')
const base_64_data = require('./countries_data/base_64_flags.json')

const corrected_base_64_data = base_64_data.map((country) => ({
  ...country,
  flag: `data:image/png;base64, ${country.flag}`,
  flag_urls: [
          `https://www.countryflags.io/${country.isoAlpha2.toLowerCase()}/shiny/32.png`,
          `https://www.countryflags.io/${country.isoAlpha2.toLowerCase()}/shiny/48.png`,
          `https://www.countryflags.io/${country.isoAlpha2.toLowerCase()}/shiny/64.png`
  ]
}))

const image_size = ['32x32', '48x48', '64x64']
const cloudinary_res = []
const cloudinary_err = []
fs.appendFileSync('./cloudinary_upload_results.json', '[')
fs.appendFileSync('./cloudinary_upload_errors.json', '[')

const cloudinary_uploader = async (country, images, index, alpha_3) => {
  return cloudinary.upload_url(images[index], image_size[index], alpha_3)
    .then((success_res) => {
      console.log(`Done Working on: ${country} for size ${image_size[index]} with url ${images[index]} corresponding to index ${index}`)
      cloudinary_res.push({ [`${country.replace(/ /gi, '_')}_${alpha_3}_${image_size[index]}`]: success_res })
      if (index < 2) {
        return cloudinary_uploader(country, images, index += 1, alpha_3)
      }
      return ({ cloudinary_res, cloudinary_err })
    }).catch((err) => {
      cloudinary_err.push({ [`${country.replace(/ /gi, '_')}_${alpha_3}_${image_size[index]}`]: err })
      console.log(`Failed for: , ${country} size ${image_size[index]} because ${err}`)
      if (index < 2) {
        return cloudinary_uploader(country, images, index += 1, alpha_3)
      }
      return ({ cloudinary_res, cloudinary_err })
    })
}

const cloudinary_results = {}
const cloudinary_errors = {}
const upload_to_cloudinary = async (index) => {
  const images_to_upload = corrected_base_64_data[index].flag_urls
  const image_alpha_3 = corrected_base_64_data[index].isoAlpha3.toLowerCase()
  return cloudinary_uploader(corrected_base_64_data[index].name, images_to_upload, 0, image_alpha_3)
    .then((upload_results) => {
      Object.assign(cloudinary_results, { [`${corrected_base_64_data[upload_index].name.replace(/ /gi, '_')}`]: upload_results })
      if (index < corrected_base_64_data.length - 1) { upload_to_cloudinary(index + 1) } else {
        fs.writeFileSync('./cloudinary_upload_results.json', `${JSON.stringify(upload_results.cloudinary_res)}`)
      }
    }).catch((error) => {
      Object.assign(cloudinary_errors, { [`${corrected_base_64_data[upload_index].name.replace(/ /gi, '_')}`]: error })
      if (index < corrected_base_64_data.length - 1) { upload_to_cloudinary(index + 1) } else {
        fs.writeFileSync('./cloudinary_upload_errors.json', `${JSON.stringify(error.cloudinary_err)}]`)
      }
    })
}

const upload_index = 0

upload_to_cloudinary(upload_index)
// fs.writeFileSync('conversion_results/corrected_base_64_data.json', JSON.stringify(corrected_base_64_data))
