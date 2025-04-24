import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [home, setHome] = useState("");

  useEffect(() => {
    axios.get("http://localhost:4000/home").then(function (response) {
      setHome(response.data);
    });
  }, []);

  const postName = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/post_name", {
        name,
      });
      console.log("Name sent successfully!");
    } catch (error) {
      console.log("Error sending name:", error);
    }
  };

  return (
    <div>
      <form onSubmit={postName}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Send name</button>
      </form>
      {home}
    </div>
  );
}

export default App;
