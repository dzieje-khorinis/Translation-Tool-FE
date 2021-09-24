import './style.scss';
import PropTypes from "prop-types";
import en from "../../static/images/bigflags/en.png";
import pl from "../../static/images/bigflags/pl.png";
import {useState} from "react";


function LangChange({languageChange, interfaceLang}) {
    const [hover, setHover] = useState(false)

    const languageToDetails = {
        'pl': {src: pl, alt: "polski (PL)", code: 'pl'},
        'en': {src: en, alt: "English (EN)", code: 'en'},
    }

    const [currentLang, setCurrentLang] = useState(languageToDetails[interfaceLang])
    const [otherLangs, setOtherLangs] = useState(Object.values(languageToDetails).filter(element => element.code !== interfaceLang))

    function languageChangeHandler(langCode) {
        setHover(false)
        languageChange(langCode)
        setCurrentLang(languageToDetails[langCode])
        setOtherLangs(Object.values(languageToDetails).filter(element => element.code !== langCode))
    }

    return <div className="langChange" onMouseEnter={e => setHover(true)}
                onMouseLeave={e => setHover(false)}>
        <img src={currentLang.src} alt={currentLang.alt}/>
        <span>{hover ? "▲" : "▼"}</span>
        {
            hover &&
            <div className="langList">
                {
                    otherLangs.map((langDetails, i) => {
                        return <img key={i} src={langDetails.src} alt={langDetails.alt}
                                    onClick={e => languageChangeHandler(langDetails.code)}
                        />
                    })
                }
            </div>
        }
    </div>
}

LangChange.propTypes = {
    languageChange: PropTypes.func.isRequired,
    interfaceLang: PropTypes.string.isRequired,
}

export default LangChange