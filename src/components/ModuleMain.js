import styles from './ModuleMain.module.css'; 


const ModuleMain = ({
    height = "",
    marginBottom = "3rem",
    background = "",
    icon = "",
    name = "",
    spanRow,
    width = "",
    padding = "",
    spanColumn,
    children
  }) => {
      
    return (
      <div
        className={styles.moduleContainer}
        style={{
          gridRow: `span ${spanRow}`,
          gridColumn: `span ${spanColumn}`,
          height,
          width,
          padding,
          marginBottom,
          background
        }}
      >
        {name !== "" ? <div className={styles.line} /> : null}
        {children}
      </div>
    );
  };
  
  export default ModuleMain;
  