module.exports = {
  pageHeadAndOG(title, description, imageUrl) {
    return {
      title: title,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'og:title', name: 'og:title', content: title },
        { hid: 'og:image', name: 'og:image', content: imageUrl },
        { hid: 'og:description', name: 'og:description', content: description },
        { hid: 'og:url', name: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' }
      ]
    }
  }
}