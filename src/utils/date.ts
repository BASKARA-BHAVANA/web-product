import moment from 'moment';

export const formatTime = (
  time: string | Date | null | undefined,
  format: string,
  {
    fb = '',
  }: {
    fb?: string;
  } = {}
) => {
  if (!time) return fb;
  return moment(time).format(format);
};

export const fromNow = (
  time: string | Date,
  {
    fb = '',
  }: {
    fb?: string;
  } = {}
) => {
  if (!time) return fb;
  return moment(time).fromNow();
};

export const toDate = (time: string | Date) => {
  return moment(time).toDate();
};
