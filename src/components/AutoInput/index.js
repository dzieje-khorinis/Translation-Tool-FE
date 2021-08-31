import "./style.scss"
import {useEffect, useRef, useState} from "react";
import {apiClient} from "../../common/apiClient";
import useOutsideClick from "../../common/useOutsideClick";
import PropTypes from "prop-types";
import {thickPartOfText} from "../../common/utils";


function AutoInput({name, language, url, value, setValue}) {
    const [searchTerm, setSearchTerm] = useState("")
    const [display, setDisplay] = useState(false)
    const [options, setOptions] = useState([])
    const [processing, setProcessing] = useState(false)
    const [autoChanged, setAutoChanged] = useState(false)

    useEffect(() => {
        setDisplay(false)

        if (searchTerm.length === 0 || autoChanged) {
            return
        }

        const delayDebounceFn = setTimeout(() => {
            setProcessing(true)
            apiClient.get(url, {search: searchTerm, language: language}).then(({status, data}) => {
                if (status === 200) {
                    setOptions(data)
                    setDisplay(true)
                }
                setProcessing(false)
            })
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [autoChanged, language, searchTerm, url])

    function selectOption(optionIndex) {
        let option = options[optionIndex]
        setAutoChanged(true)
        setSearchTerm(option.name)
        setValue(option.name)
    }

    function eraseSearchTerm() {
        if (value) {
            setAutoChanged(true)
            setSearchTerm("")
            setValue("")
        }
    }

    const onChange = (e) => {
        let currentSearch = e.target.value
        setAutoChanged(false)
        setSearchTerm(currentSearch)
    }

    const onKeyDown = (e) => {
        switch (e.key) {
            case "Enter":
                if (e.target.value === "") {
                    eraseSearchTerm()
                }
                break
            case "Esc":
            case "Escape":
                eraseSearchTerm()
                break
            default:
                return
        }
    }

    const onBlur = (e) => {
        if (e.target.value === "") {
            eraseSearchTerm()
        }
    }

    const ref = useRef()

    useOutsideClick(ref, () => {
        setDisplay(false)
    })

    return (
        <>
            <input
                id={`id_${name}`}
                className={`auto_input${autoChanged?" good":""}`}
                name={name}
                type="text"
                ref={ref}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                value={searchTerm}
            />
            {
                processing &&
                <div className="input_spinner"/>
            }
            {
                display && options.length > 0 && (
                    <div className="auto_container">
                        {
                            options.slice(0, 10).map((v, i) => {
                                return <div className="option" key={i} onClick={() => selectOption(i)}>
                                    <span>{thickPartOfText(v.name, searchTerm)}</span>
                                </div>
                            })
                        }
                    </div>
                )
            }
        </>
    );
}

AutoInput.propTypes = {
    name: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
}
export default AutoInput;
