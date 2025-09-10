import "./page.scss";
import AlbumCover from "@/components/common/AlbumCover";
import { IMAGE_SAMPLE_LIST } from "@/constants";
import { bebasNeue } from "./fonts";
import { shuffleNumber } from "@/utils/utils";

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
            <AlbumCover imgSrc={`/home/${src}`} />
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
