import React from "react";
import home from "../../styles/home.module.scss";

function HomeHeader() {
  return (
    <div className={home.main_header}>
      <div className={home.text_headings}>
        <h1>Welcome to dmod.</h1>
        <p>Discords most advanced moderator searching application.</p>
      </div>
      <div className={home.search_container}>
        <input placeholder="Search dmod." className={home.search_bar}></input>
        <button className={home.search_button}>Search.</button>
      </div>
    </div>
  );
}

export default HomeHeader;
