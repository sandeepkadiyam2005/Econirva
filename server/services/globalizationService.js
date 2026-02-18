import { prisma } from '../config/database.js';

const SUPPORTED_LANGUAGES = ['en', 'hi', 'ar', 'es'];
const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'AED'];

export const getLocalizationOptions = () => ({
  languages: SUPPORTED_LANGUAGES,
  currencies: SUPPORTED_CURRENCIES,
});

export const estimateTaxAndRegionalPrice = async ({ countryCode, regionCode, currency, baseAmount }) => {
  const [taxRules, regionalRule] = await Promise.all([
    prisma.taxRule.findMany({ where: { countryCode, OR: [{ regionCode }, { regionCode: null }] } }),
    prisma.regionPricingRule.findUnique({ where: { regionCode_currency: { regionCode, currency } } }).catch(() => null),
  ]);

  const subtotal = Number(baseAmount);
  const multiplier = regionalRule ? Number(regionalRule.multiplier) : 1;
  const adjustedBase = subtotal * multiplier;
  const taxRate = taxRules.reduce((acc, rule) => acc + Number(rule.rate), 0);
  const taxAmount = adjustedBase * taxRate;

  return {
    adjustedBase,
    taxRate,
    taxAmount,
    total: adjustedBase + taxAmount,
    currency,
  };
};
