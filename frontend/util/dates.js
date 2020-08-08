import moment from 'moment';

export const publishedAt = function (date) {
  return !date ? '' : moment(date).format('MMMM Do YYYY');
}