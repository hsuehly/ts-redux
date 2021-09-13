import React, { FC } from "react";
import style from './OtherLayout.module.css'

export const OtherLayout: FC = ({children}) => {


  return <div className={style.other}>
    {children}
  </div>
}