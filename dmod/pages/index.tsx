import { homedir } from 'os';
import HomeHeader from '../components/headers/HomeHeader';
import OpenGraphHead from '../components/OpenGraphHead';
import home from '../styles/home.module.scss';

export default function Home() {
  return (
    <div>
      <OpenGraphHead title={"Welcome to Dmod.gg"} description={"The best place to hire moderators!"} image={"/logo.png"}></OpenGraphHead>
      <HomeHeader></HomeHeader>
      <div className={home.home_main_content}>
        <div className={home.top_rated}>
          <div className={home.heading}>
            <h1>Top rated moderators.</h1>
            <p>Based on user feedback these people are the best!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
