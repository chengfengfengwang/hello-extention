import { useState, useEffect } from "react";
function rafThrottle(fn) {
  let locked = false;
  return function (...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame((_) => {
      fn.apply(this, args);
      locked = false;
    });
  };
}
function RenderImg({ imgUrl, index }) {
  const [scale, setScale] = useState(1);
  const [marginLeft, setMarginLeft] = useState(0);
  const [marginTop, setMarginTop] = useState(0);

  const zoomIn = (zoomRate = 0.2) => {
    setScale(Number((scale + zoomRate).toFixed(3)));
  };
  const zoomOut = (zoomRate = 0.2) => {
    setScale(Number((scale - zoomRate).toFixed(3)));
  };
  const handleMouse = rafThrottle(function (e) {
    e.preventDefault();
    const el = e.target;
    const moveFn = (e) => {
      // el.style.top = el.offsetTop + e.movementY + "px";
      // el.style.left = el.offsetLeft + e.movementX + "px";
      setMarginLeft((val) => val + e.movementX);
      setMarginTop((val) => val + e.movementY);
    };
    el.addEventListener("mousedown", function (e) {
      e.preventDefault();
      document.addEventListener("mousemove", moveFn);
    });
    document.addEventListener("mouseup", function (e) {
      document.removeEventListener("mousemove", moveFn);
    });
  });
  const handleMouseWheel = rafThrottle(function (e) {
    e.preventDefault();
    const data = e.wheelDelta | -e.deltaY; // todo
    if (data > 0) {
      zoomIn(0.015);
    } else {
      zoomOut(0.015);
    }
  });
  return (
    <div
      key={index}
      className={`drag drag${index + 1}`}
      onWheel={handleMouseWheel}
      onMouseDown={handleMouse}
    >
      <img
        style={{
          transform: `scale(${scale})`,
          marginLeft: marginLeft,
          marginTop: marginTop,
        }}
        draggable="false"
        src={imgUrl}
      />
      <div className="el-image-viewer__btn el-image-viewer__actions">
        <div className="el-image-viewer__actions__inner">
          <i onClick={() => zoomOut()} className="el-icon-zoom-out"></i>
          <i onClick={() => zoomIn()} className="el-icon-zoom-in"></i>
        </div>
      </div>
    </div>
  );
}
function App() {
  const imgs = Array.from(document.querySelectorAll("img"));
  const maxWidth = Math.max.apply(
    null,
    imgs.map((img) => img.width)
  );
  const guitarImgs = imgs.filter((img) => img.width === maxWidth);
  const results = guitarImgs.map((e) => e.src);

  // const results = [
  //   // "https://pic.jitapai.com/wp-content/uploads/2020/09/2020092413191722.jpeg?x-oss-process=image/format,webp",
  //   'https://pic.jitapai.com/wp-content/uploads/2020/09/2020092413191734.jpeg?x-oss-process=image/format,webp',
  //   'https://www.jitakong.com/wp-content/uploads/2022/05/1-117.png',
  //   'https://www.jitakong.com/wp-content/uploads/2022/05/2-118.png'
  // ];

  useEffect(() => {
    document.querySelectorAll(".drag").forEach((e) => {
      if (results.length === 2) {
        e.style.height = '100vh';
      } else {
        e.style.width = (100 / results.length).toFixed(3) + "vw";
      }
    });
  }, []);

  return results.map((item, index) => RenderImg({ imgUrl: item, index }));
}
export default App;
