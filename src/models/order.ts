interface Order {
  readonly ID: number;
  readonly itemId: number;
  readonly userId: number;
  readonly quantity: number;
  readonly total: number;
}

export {Order};