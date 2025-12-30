import dateConfig from '../config/dateFormat.js';

export function formatDate(rawDate) {
  // rawDate: 22/12/25
  const [dd, mm, yy] = rawDate.split('/');

  const year = yy.length === 2 ? `20${yy}` : yy;

  const date = new Date(`${year}-${mm}-${dd}`);

  return date.toLocaleDateString(
    dateConfig.locale,
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  );
}
