import { CHANGE_LANGUAGE } from "../constants/language";

const initLang = 'zh_CN';

export default function changeLanguage(prevState = initLang, action) {
  const {type,data} = action
  switch (type) {
    case CHANGE_LANGUAGE:
      return data;
    default:
      return prevState;
  }
}
