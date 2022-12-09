import { useState, useEffect, Fragment, useRef } from "react";
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
function getProperty(ele) {
  const styleObj = getComputedStyle(ele);
  const left = parseFloat(styleObj.left);
  const top = parseFloat(styleObj.top);
  const width = parseFloat(styleObj.width);
  const height = parseFloat(styleObj.height);
  return {
    left,
    top,
    width,
    height,
  };
}


function RenderImg({ imgUrl, index, allImg, setResults }) {
  const imgRef = useRef(null);
  const toolRef = useRef(null);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(window.innerWidth / allImg.length);

  const handleZoomIn = (e) => {
    const currentImg = imgRef.current;
    setWidth(width + 50);
    setLeft(left - 25);
    setTop(top - 25);
    renderTool(currentImg)
  }
  const handleZoomOut = (e) => {
    const currentImg = imgRef.current;
    setWidth(width - 50);
    setLeft(left + 25);
    setTop(top + 25);
    renderTool(currentImg)
  }
  const handleRemove = (e) => {
    // const parentObj = currentImg.parentNode; //获取div的父对象
    // const tool = toolRef.current;
    // parentObj.removeChild(currentImg);
    // parentObj.removeChild(tool);
    console.log('----', allImg.filter((url,idx) => idx!== index));
    setResults(allImg.filter((url,idx) => idx!== index))
  }
  const handleMouseDown = rafThrottle(function (e) {
    e.preventDefault();
    const target = e.target;
    const startX = e.pageX;
    const startY = e.pageY;
    const handleMouseMove = (e) => {
      setLeft(left + e.pageX - startX);
      setTop(top + e.pageY - startY);
      renderTool(target)
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", (e) => {
      document.removeEventListener("mousemove", handleMouseMove);
    });
  });
  const load = (e) => {
    const target = e.target;
    setLeft((window.innerWidth / allImg.length) * index);
    setTop(0);
    setWidth(window.innerWidth / allImg.length);
    // renderTool(target)
  };
  const renderTool = (target) => {
    const tool = toolRef.current;
    const { width: toolWidth, height: toolHeight } = getProperty(tool);
    const {
      left: imgLeft,
      top: imgTop,
      width: imgWidth,
      height: imgHeight,
    } = getProperty(target);
    tool.style.left = imgLeft + imgWidth / 2 - toolWidth / 2 + "px";
    tool.style.top = imgTop + imgHeight / 2 - toolHeight / 2 + "px";
    tool.style.display = "block";
  };
  return (
    <Fragment key={index}>
      <img
        style={{
          left: left,
          top: top,
          width: width
        }}
        ref={imgRef}
        onLoad={load}
        className={`drag drag${index + 1}`}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          renderTool(e.target);
        }}
        draggable="false"
        src={imgUrl}
      />
      <div ref={toolRef} className={`tool tool${index}`}>
        <div className="tool_inner">
          <img onClick={handleZoomIn} className="zoom_in" src={require("./imgs/zoom-in.png")} alt="" />
          <img
            onClick={handleZoomOut}
            className="zoom_out"
            src={require("./imgs/zoom-out.png")}
            alt=""
          />
          <img onClick={handleRemove} className="remove" src={require("./imgs/remove.png")} alt="" />
        </div>
      </div>
    </Fragment>
  );
}


function App() {
  const imgs = Array.from(document.querySelectorAll("img"));
  const maxWidth = Math.max.apply(
    null,
    imgs.map((img) => img.width)
  );
  const guitarImgs = imgs.filter((img) => img.width === maxWidth);
  // const results = guitarImgs.map((e) => e.src);

  // const results = [
  //   // "https://pic.jitapai.com/wp-content/uploads/2020/09/2020092413191722.jpeg?x-oss-process=image/format,webp",
  //   // "https://pic.jitapai.com/wp-content/uploads/2020/09/2020092413191734.jpeg?x-oss-process=image/format,webp",
  //   // "https://www.jitakong.com/wp-content/uploads/2022/05/1-117.png",
  //   // "https://www.jitakong.com/wp-content/uploads/2022/05/2-118.png",
  //   "https://iph.href.lu/600x848",
  //   "https://iph.href.lu/600x848"
  // ];
  const [results, setResults] = useState([
    "https://iph.href.lu/600x848",
    "https://iph.href.lu/600x848",
    "https://iph.href.lu/600x848"
  ])

  return (
    <>{results.map((item, index) => RenderImg({ imgUrl: item, index , allImg:results, setResults}))}</>
  );
}
export default App;
