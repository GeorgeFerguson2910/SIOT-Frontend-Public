import React, { useState, useEffect } from "react";
import styles from "./PubMed.module.css";
import ScreenHeader from "../components/ScreenHeader.js";
import ModuleMain from "../components/ModuleMain.js";

const PubMed = () => {

  return (
    <div className={styles.mainWhiteContainer}>
      <ScreenHeader name="PubMed Queries"/>
      <ModuleMain>
      </ModuleMain>
    </div>
  );
};

export default PubMed;