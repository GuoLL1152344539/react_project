import React from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layouts";
import {IntlProvider} from 'react-intl'
import language from '@/locales'
import "./assets/css/reset.css";

export default function App() {
  return (
    <BrowserRouter>
      <IntlProvider messages={language.zh_CN} locale='en'>
			  <Layout/>
      </IntlProvider>
    </BrowserRouter>
    
  );
}
