import { prisma } from '../config/database.js';

export const createForecast = async ({ tenantId, forecastType, context }) => {
  const demandBaseline = Number(context.last30DaysOrders || 0);
  const seasonalityFactor = Number(context.seasonalityFactor || 1);
  const churnRisk = Math.min(1, Number(context.churnSignals || 0) / 100);

  const predictionPayload = {
    projectedOrdersNext30Days: Math.round(demandBaseline * seasonalityFactor * (1 - churnRisk)),
    suggestedRestockUnits: Math.round(demandBaseline * 1.25),
    bestSellingBagType: context.topCategory || 'compostable-grocery-bag',
    churnRisk,
  };

  return prisma.aiPrediction.create({
    data: {
      tenantId,
      predictionType: forecastType,
      context,
      prediction: predictionPayload,
      confidence: 0.78,
    },
  });
};
