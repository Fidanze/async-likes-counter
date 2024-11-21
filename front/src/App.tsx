import { useCallback, useEffect, useState } from "react";
import likeLogo from "./assets/like.svg";
import "./App.scss";

function App() {
  const [count, setCount] = useState(0);

  const onClick = useCallback(() => {
    setCount((count) => count + 1);
    fetch("http://alc.localhost/api/add").catch(() =>
      setCount((count) => count - 1)
    );
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      const res = await fetch("http://alc.localhost/api/get");
      setCount(await res.json());
    };
    setInterval(fetchCount, 5000);
  }, []);

  return (
    <>
      <button onClick={onClick}>
        <img src={likeLogo} className="logo" alt="Vite logo" />
        <span>{count}</span>
      </button>
    </>
  );
}

export default App;
