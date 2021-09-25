import "./style.scss"
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import AutoInput from "../AutoInput";
import {apiPathFilePathsSearch, apiPathFileTreeNodes, apiPathFileTreeRoot} from "../../common/routes";
import {LANGUAGES, ROLE_ADMIN, STATUSES} from "../../common/constants";
import {langCodeToIcon, langCodeToLangName} from "../../common/utils";
import Select, {components} from "react-select";
import FileTree from "../FileTree";
import {Chart} from "react-google-charts";

const {Option} = components;


function SidePane({user, filters, setFilters, aggregations}) {
    const {t} = useTranslation('common');

    const [searchTermTemp, setSearchTermTemp] = useState('')

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTermTemp !== filters.searchTerm) {
                setFilters({searchTerm: searchTermTemp})
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [filters.searchTerm, searchTermTemp, setFilters])

    const statuses = STATUSES()
    let statusItems = [...statuses.keys()].map(statusCode => {
        return {
            value: statusCode,
            label: statuses.get(statusCode),
        }
    })

    const languages = LANGUAGES()
    const dataLang = filters.dataLanguage

    return (
        <section className="side-pane">
            <div className="input_wrapper">
                <label htmlFor="id_state_lang">{t("DATA LANGUAGE")}</label>
                {
                    user.role >= ROLE_ADMIN ?
                        <Select
                            value={{value: dataLang, label: `${languages.get(dataLang)} (${dataLang})`}}
                            isDisabled={false}
                            isLoading={false}
                            isClearable={false}
                            isRtl={false}
                            isSearchable={false}
                            onChange={(option, {action}) => {
                                setFilters({dataLanguage: option.value})
                            }}
                            options={
                                Array.from(languages).map(([key, value]) => {
                                    return {value: key, label: `${value} (${key})`, icon: langCodeToIcon[key]}
                                })
                            }
                            components={{
                                Option: props => (
                                    <Option {...props}>
                                        <img
                                            src={props.data.icon}
                                            alt={props.data.label}
                                        />
                                        <span style={{marginLeft: 10}}>{props.data.label}</span>
                                    </Option>
                                )

                            }}
                        />
                        :
                        <p>{langCodeToLangName(user.roleLang)} ({user.roleLang})</p>
                }
            </div>

            <div className="input_wrapper">
                <label htmlFor="id_search">{t("SEARCH TERM")}</label>
                <input className="custom_input" id="id_search" name="search" type="text" value={searchTermTemp}
                       onChange={e => setSearchTermTemp(e.target.value)}/>
            </div>

            <div className="input_wrapper">
                <label htmlFor="id_group">{t("FILEPATH")}</label>
                <AutoInput
                    language={filters.dataLanguage}
                    name="path"
                    url={apiPathFilePathsSearch}
                    value={filters.path}
                    setValue={(value) => {
                        setFilters({path: value})
                    }}
                    optionName="path"
                />
            </div>

            <div className="input_wrapper">
                <label htmlFor="id_group">{t("FILE TREE")}</label>
                <FileTree
                    rootUrl={apiPathFileTreeRoot}
                    getChildrenUrl={parent_id => apiPathFileTreeNodes.replace("{parent_id}", parent_id)}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>

            <div className="input_wrapper">
                <label htmlFor="id_state">{t("STATE")}</label>
                <Select
                    placeholder={""}
                    options={statusItems}
                    value={
                        filters.states.map(element => {
                            return {
                                value: element,
                                label: statuses.get(element),
                            }
                        })
                    }
                    onChange={(option, {action}) => {
                        setFilters({states: option.map(element => element.value)})
                    }}
                    isMulti
                />
            </div>

            <div className="input_wrapper">
                <table>
                    {
                        statusItems.map((item, i) => <tr key={i}>
                            <td><span data-status={item.value} className="statusCircle"/><span
                                class="statusTitle">{item.title}</span></td>
                            <td>{item.value && aggregations[item.value] ? aggregations[item.value][0] : 0}</td>
                            <td>{item.value && aggregations[item.value] ? aggregations[item.value][1] : 0}</td>
                        </tr>)
                    }
                </table>

                <Chart
                    width={'100%'}
                    height={'300px'}
                    chartType="PieChart"

                    backgroundColor="red"
                    options={{
                        legend: "none",
                        chartArea: {
                            left: 0,
                            height: 250,
                            width: 600
                        },
                        backgroundColor: "#16202F",
                        legendTextStyle: {
                            color: "white",
                            fontSize: 15,
                        },
                        is3D: true,
                        colors: ["287d98", "b4a828", "b4701e", "ad3a34", "3a7f38"],
                        sliceVisibilityThreshold: 0,

                    }}
                    data={[
                        ['', ''],
                        ...statusItems.map(item => [item.label, item.value && aggregations[item.value] ? aggregations[item.value][0] : 0])
                    ]}
                />
            </div>
        </section>
    )
}


export default SidePane;
