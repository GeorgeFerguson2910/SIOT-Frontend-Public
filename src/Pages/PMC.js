import React, { useState, useEffect } from "react";
import styles from "./PubMed.module.css";
import ScreenHeader from "../components/ScreenHeader.js";
import ModuleMain from "../components/ModuleMain.js";

const PMC = () => {

  return (
    <div className={styles.mainWhiteContainer}>
      <ScreenHeader name="PMC Queries"/>
      <ModuleMain>
      </ModuleMain>
    </div>
  );
};

export default PMC;