import cheerio from 'cheerio'
import got from 'got'
import urlUtil from 'url'

export default {
  /**
   * Extract basic information from link
   * @param  {string} url Link Url that needs to be fetched
   * @param  {string} cat Category that needs to be attached
   * @return {object}     Returns object
   */
  extractLink (url, cat) {
    return new Promise((resolve, reject) => {
      got(url, { useElectronNet: false }).then(response => {
        const $ = cheerio.load(response.body)
        const title = $('title').text()
        const favicon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="Shortcut Icon"]').last().attr('href')
        resolve({
          title: title,
          favicon: urlUtil.resolve(response.url, favicon),
          category: {
            name: cat.name,
            color: cat.color
          },
          favourite: false,
          url: urlUtil.resolve(url)
        })
      })
    })
  }
}
