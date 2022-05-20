import './style.scss';
import { useTranslation } from "react-i18next";
import {useState} from "react";
import circleArrowUpSolidIcon from "../../static/images/circle-arrow-up-solid.svg"

function ScrollToTop() {
    const {t} = useTranslation('common');

    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true)
        }
        else if (scrolled <= 300) {
            setVisible(false)
        }
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        });
    };

    window.addEventListener('scroll', toggleVisible);

    return (
        <>
        {
            visible &&
            // <button className='scroll_to_top'>
            //     <FaArrowCircleUp onClick={scrollToTop} style={{size: 20}} />
            // </button>

            <span className='link scroll_to_top' onClick={scrollToTop}><img title={t('Scroll to top')} src={circleArrowUpSolidIcon}/></span>
        }
        </>
    );


}

ScrollToTop.propTypes = {}
export default ScrollToTop;
