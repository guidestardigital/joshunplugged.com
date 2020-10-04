'use strict';

const Filter = require('bad-words');
const filter = new Filter({
  placeHolder: '~'
});
filter.removeWords('hell', 'hells');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate(data) {
      data.text_uncleaned = data.text;
      data.text = filter.clean(data.text);
    }
  }
};
