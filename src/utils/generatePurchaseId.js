import Purchase from "../models/Purchase.js";

export const generatePurchaseId = async () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

 
  const todayPrefix = `${year}-${month}-${day}-`;

  const last = await Purchase.find({
    purchaseId: new RegExp(`^${todayPrefix}`)
  })
    .sort({ purchaseId: -1 })
    .limit(1);

  let nextNumber = 1;

  if (last.length > 0) {
    const parts = last[0].purchaseId.split("-");
    nextNumber = parseInt(parts[3]) + 1;
  }

  return `${year}-${month}-${day}-${nextNumber}`;
};
