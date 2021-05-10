export function imageToSize(image, size) {
  if (!image) {
    return '';
  }

  size = size || 'medium';

  if (size === 'original') {
    return image.url;
  } if (process.client && size === 'dynamic') {
    if (window.innerWidth < 500) {
      size = 'medium';
    } else if (window.innerWidth < 1200) {
      size = 'large';
    } else if (window.innerWidth >= 1200) {
      return url; // If the window is large enough just use the original
    }
  } else if (size === 'dynamic') {
    size === 'large';
  }

  if (image.formats && image.formats[size]) {
    return image.formats[size].url;
  }

  return image.url;
}

export function imageUrlToSize(url, size) {
  size = size || 'medium';

  if (size === 'original') {
    return url;
  } if (process.client && size === 'dynamic') {
    if (window.innerWidth < 500) {
      size = 'medium';
    } else if (window.innerWidth < 1200) {
      size = 'large';
    } else if (window.innerWidth >= 1200) {
      return url; // If the window is large enough just use the original
    }
  } else if (size === 'dynamic') {
    size === 'large';
  }

  const imageUrlSplit = url.split('/');
  const ix = imageUrlSplit.length - 1;
  imageUrlSplit[ix] = `${size}_${imageUrlSplit[ix]}`;
  return imageUrlSplit.join('/');
}

export function imageStyleBackground(image, horizontal_percent, vertical_percent) {
  if (!image) return;

  let style = `background: url(${imageUrlToSize(image.url, 'dynamic')});`;

  vertical_percent = vertical_percent || 50;
  horizontal_percent = horizontal_percent || 50;
  style += `background-position: ${horizontal_percent}% ${vertical_percent}%;`;
  return style;
}