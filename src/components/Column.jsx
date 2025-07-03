import Slot from "./Slot";

export default function Column({ slots, onBallClick, onDrop }) {
  const filledSlots = slots.filter(color => color !== null).length;
  const totalSlots = slots.length;
  const waterHeight = (filledSlots / totalSlots) * 100;

  const topBallIndex = slots.findIndex(color => color !== null);

  return (
    <div
      className="relative w-20 h-[320px] flex flex-col items-center glass-tube cursor-pointer"
      onClick={onDrop}
    >
      <div
        className="absolute bottom-0 left-0 w-full bg-blue-300 opacity-50 water-level"
        style={{ height: `${waterHeight}%` }}
      ></div>
      {slots.map((color, slotIndex) => (
        <Slot
          key={slotIndex}
          color={color}
          onClick={() => {
            if (slotIndex === topBallIndex && color) {
              onBallClick();
            }
          }}
        />
      ))}
    </div>
  );
}

