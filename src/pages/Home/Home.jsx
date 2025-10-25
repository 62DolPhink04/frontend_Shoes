import { Helmet } from "react-helmet-async";
import ChatWidget from "../ChatWidget";
import HeroContainer from "../Home/Hero/HeroContainer";
import PopularClasses from "../Home/PopularClasses/PopularClasses";
import PopularTeacher from "../Home/PopularTeacher/Popularteacher";
import Gallary from "./Gallary/Gallary";

const Home = () => {
  return (
    <section>
      <Helmet>
        <title>Nike - Giày Thể Thao Chính Hãng</title>
        <meta
          name="description"
          content="Shop chuyên cung cấp giày Nike, Adidas, Puma... chính hãng. Giao hàng toàn quốc, bảo hành 1 đổi 1. Mua ngay!"
        />

        <meta property="og:title" content="Nike - Giày Thể Thao Chính Hãng" />
        <meta
          property="og:description"
          content="Shop chuyên cung cấp giày Nike chính hãng."
        />
      </Helmet>
      <HeroContainer />
      <div className="max-w-screen-xl mx-auto">
        <Gallary />
        <PopularClasses />
        <PopularTeacher />
      </div>
      <ChatWidget />
    </section>
  );
};
export default Home;
