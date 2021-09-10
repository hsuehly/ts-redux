import React,{} from "react";
import styles from "./Header.module.css";

export const Header = () => {



  return <>
  {/* module.css 的使用方法, 会在编译后添加一些其他其他值*/}
  <div className={styles.header}>
    这是顶部Header组件
  </div>
  </>
}  