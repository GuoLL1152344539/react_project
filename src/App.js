import React from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layouts";
import {IntlProvider} from 'react-intl'
import { connect } from "react-redux";
import language from '@/locales'
import { ConfigProvider } from 'antd';
import en from 'antd/es/locale/en_US';
import zh_CN from 'antd/es/locale/zh_CN';
import zh_TW from 'antd/es/locale/zh_TW';
import "./assets/css/reset.css";
const antdLang = {zh_CN, zh_TW, en}
function App({lang}) {
  
  return (
    <BrowserRouter>
      <ConfigProvider locale={antdLang[lang]} >
        <IntlProvider messages={language[lang]} locale='en'>
          <Layout/>
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
    
  );
}

export default connect(
  (state)=>({lang:state.language})
)(App)