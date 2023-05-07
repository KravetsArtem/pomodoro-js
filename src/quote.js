export const getQuoteOfTheDay = async () => {
  const quoteResponse = await fetch('https://zenquotes.io/api/today').then(res => res.json());
  return quoteResponse[0].q;
}