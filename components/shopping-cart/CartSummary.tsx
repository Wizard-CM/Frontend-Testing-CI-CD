type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
};

const CartSummary = ({ subtotal, itemCount, onCheckout }: CartSummaryProps) => {
  return (
    <div className="mt-4 border-t border-zinc-200 pt-4">
      <h2 className="font-semibold text-black mb-2">Order Summary</h2>
      <p className="text-zinc-600">Items: {itemCount}</p>
      <p className="text-black font-medium text-lg">Subtotal: ${subtotal.toFixed(2)}</p>
      <button
        onClick={onCheckout}
        disabled={itemCount === 0}
        className="mt-3 bg-black text-white rounded px-4 py-2 font-medium hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500"
      >
        Checkout
      </button>
    </div>
  );
};

export default CartSummary;
