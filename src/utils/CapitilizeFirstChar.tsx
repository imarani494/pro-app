export default function capitializeFirstChar(str = '', split = ' ') {
  return (str || '')
    .toLowerCase()
    .split(split)
    .map(a => {
      return `${(a.charAt(0) || '').toUpperCase()}${a.slice(1)}`;
    })
    .join(' ');
}
