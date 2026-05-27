type CartItemProps = {
  name: string;
  price: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

const CartItem = ({
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) => {
  return (
    <div role="listitem" className="flex items-center justify-between border border-zinc-200 rounded p-3">
      <div>
        <h3 className="font-medium text-black">{name}</h3>
        <p className="text-zinc-600">${(price * quantity).toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onDecrease} aria-label={`Decrease ${name} quantity`} className="w-8 h-8 border border-zinc-300 rounded flex items-center justify-center text-black hover:bg-zinc-100">
          -
        </button>
        <span aria-label={`${name} quantity`} className="w-8 text-center text-black">{quantity}</span>
        <button onClick={onIncrease} aria-label={`Increase ${name} quantity`} className="w-8 h-8 border border-zinc-300 rounded flex items-center justify-center text-black hover:bg-zinc-100">
          +
        </button>
      </div>

      <button onClick={onRemove} aria-label={`Remove ${name} from cart`} className="text-red-600 text-sm hover:underline">
        Remove
      </button>
    </div>
  );
};

export default CartItem;
