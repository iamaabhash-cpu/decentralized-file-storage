import "./index.css";

import Upload from "./components/Upload";
import Download from "./components/Download";

function App() {

  const handleMouseMove = (e) => {

    const shapes = document.querySelectorAll(
      ".circle, .square, .triangle"
    );

    const x = (window.innerWidth / 2 - e.clientX) / 80;
    const y = (window.innerHeight / 2 - e.clientY) / 80;

    shapes.forEach((shape) => {
      shape.style.translate = `${x}px ${y}px`;
    });

  };

  return (

    <div className="app" onMouseMove={handleMouseMove}>

      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      <div className="square square1"></div>
      <div className="square square2"></div>

      <div className="triangle triangle1"></div>
      <div className="triangle triangle2"></div>

      <div className="container">

        <h1>Decentralized File Storage</h1>

        <p>Store and retrieve files securely using IPFS + Pinata</p>

        <Upload />

        <Download />

      </div>

    </div>

  );
}

export default App;