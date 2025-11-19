import { useState } from "react";
import { Link } from "react-router-dom";

const UnregisterHome = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  return (
    <section>
      <div className="mx-5 my-10">
        <button
          className="bg-primary text-white rounded-md p-2 hover:bg-cta transition duration-300 ease-in-out"
          onClick={() => setIsAvailable(!isAvailable)}
        >
          Click Me
        </button>
      </div>
      {isAvailable ? (
        <div className="text-red-500 m-5">Is Available</div>
      ) : (
        <div className="text-green-500 m-5">Is not Available</div>
      )}
    </section>
  );
};

export default UnregisterHome;
