exports.areAllItemsInInventory = (order) => {
  return order.orderItems.every(item => item.isArrivedAtInventory);
};
