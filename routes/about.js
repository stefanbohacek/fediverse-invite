import express from 'express';
import getThemeCSS from '../modules/getThemeCSS.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('../views/about.handlebars', {
        theme_css_url: getThemeCSS(req.query.theme),
        supported_languages: JSON.stringify(res.locals.languages),
        translations: res.translations,
        current_locale: res.currentLocale,
        footer_scripts: process.env.FOOTER_SCRIPTS
    });
});

export default router;