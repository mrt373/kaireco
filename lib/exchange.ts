export async function getCurrentCurrency(
  currentRate: string,
  anotherRate: string[],
): Promise<Record<string, number>> {
  const URL = `https://api.frankfurter.app/latest?from=${currentRate}&to=${anotherRate.join(",")}`;
  const response = await fetch(URL);
  const data = await response.json();
  return data.rates;
}
