import { useState } from "react";
import Light from "./Light";
import MainUI from "./MainUI";

function App() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      {!isSwitchOn ? (
        <Light onToggle={() => setIsSwitchOn(true)} />
      ) : (
        <MainUI />
      )}
    </div>
  );
}

export default App;





















      
