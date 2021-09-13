import React, { FC } from "react";
import { Header, Footer } from "../../components";
import style from './MainLayout.module.css'
export const MainLaout: FC = ({children}) => {


  return <>
  <Header/>
  <div className={style.main}>{children}</div>
  <Footer/>
  </>
}