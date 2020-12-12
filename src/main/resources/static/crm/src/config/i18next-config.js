/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';

i18n.use(LanguageDetector).use(XHR).use(initReactI18next).init({
    backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    fallbackLng: "ru",
    debug: false,
    whitelist: ["ru", "en"],
    interpolation: {
        escapeValue: false
    }
});

export default i18n;