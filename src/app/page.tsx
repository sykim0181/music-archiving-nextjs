import "./page.scss";
import { IMAGE_SAMPLE_LIST } from "@/constants";
import { bebasNeue } from "./fonts";
import { shuffleNumber } from "@/utils/utils";
import Image from "next/image";

const Home = () => {
  const randomNumbers = shuffleNumber(IMAGE_SAMPLE_LIST.length); // 21

  return (
    <div className="home_content">
      <div className="sample-list">
        {IMAGE_SAMPLE_LIST.map((src, idx) => (
          <div
            key={src}
            className={`sample-list-item ${
              idx === 20 ? "hide-by-viewport" : ""
            }`}
            style={{
              animationDelay: `${100 * randomNumbers[idx]}ms`,
            }}
          >
            <Image
              src={`/home/${src}`}
              alt=""
              fill
              sizes="(max-width: 768px) 34vw, (max-width: 992px) 25vw, 20vw"
            />
          </div>
        ))}
      </div>

      <h1 className={`home_content_text ${bebasNeue.className}`}>
        Archive Your Favorite Albums!
      </h1>
    </div>
  );
};

export default Home;
