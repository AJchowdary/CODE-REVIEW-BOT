interface LightProps {
  onToggle: () => void;
}

const Light = ({ onToggle }: LightProps) => {
  const handleClick = () => {
    const bulb = document.querySelector(".bulb");
    const body = document.body;

    if (bulb && body) {
      bulb.classList.toggle("bulb-on");
      body.classList.toggle("light");

      setTimeout(() => {
        onToggle();
      }, 2000); // delay before switching to MainUI
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="bulb mb-8 w-24 h-24 bg-yellow-500 rounded-full transition-shadow duration-700 shadow-md" />
      <button
        onClick={handleClick}
        className="relative inline-flex items-center h-12 w-24 rounded-full p-1 bg-gray-700 hover:bg-gray-600"
      >
        <span className="sr-only">Toggle Light</span>
        <span className="inline-block h-10 w-10 transform rounded-full bg-yellow-300 transition-transform duration-300 translate-x-0" />
      </button>
    </div>
  );
};

export default Light;






