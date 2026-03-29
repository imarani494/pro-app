export const getAirlineLogo = function (carA: any, lIcon: any) {
  const iconStr = lIcon ? 'licons' : 'icons';
  const carStr = Array.isArray(carA)
    ? carA.length > 1
      ? 'MULT'
      : carA[0]
    : carA;

  return `//cdn.yourholiday.me/static/img/poccom/airlines/${iconStr}/${carStr}.gif`;
};

const domain = 'https://krm2.typeyourtrip.com/api';

export const PreocessImageUrl = (url: string | undefined | null): string => {
  if (typeof url !== 'string') return '';
  return url.startsWith('http')
    ? url
    : url.startsWith('//')
    ? `https:${url}`
    : `${domain?.replace('/api', '')}${url}`;
};
