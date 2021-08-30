import "./style.scss"
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import AutoInput from "../AutoInput";
import {apiPathGroups} from "../../common/routes";
import {ROLE_ADMIN, STATUSES} from "../../common/constants";
import {langCodeToLangName} from "../../common/utils";


function SidePane({user, filters, setFilters, aggregations}) {
    const {t} = useTranslation('common');

    const [searchTermTemp, setSearchTermTemp] = useState('')

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilters({searchTerm: searchTermTemp})
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTermTemp, setFilters])

    const statuses = STATUSES()
    let statusItems = [...statuses.keys()].map(statusCode => {
        return {
            value: statusCode,
            title: statuses.get(statusCode)
        }
    })


    return (
        <section className="side-pane">
            {/*<p>searchTermTemp: {searchTermTemp}</p>*/}
            {/*<p>searchTerm: {filters.searchTerm}</p>*/}
            {/*<p>dataLanguage: {filters.dataLanguage}</p>*/}
            {/*<p>group: {filters.group}</p>*/}
            {/*<p>state: {filters.state}</p>*/}

            <div className="input_wrapper">
                <label htmlFor="id_state_lang">{t("DATA LANGUAGE")}</label>
                {
                    user.role >= ROLE_ADMIN ?
                        <select id="id_state_lang" value={filters.dataLanguage}
                                onChange={e => setFilters({dataLanguage: e.target.value})}>
                            <option value="en">Angielski (en)</option>
                            <option value="pl">Polski (pl)</option>
                            <option value="de">Niemiecki (de)</option>
                            <option value="ru">Rosyjski (ru)</option>
                        </select>
                        :
                        <p>{langCodeToLangName(user.roleLang)} ({user.roleLang})</p>
                        // <p>{roleIdToText(user.role, user.roleLang)}</p>
                }
            </div>

            <div className="input_wrapper">
                <label htmlFor="id_search">{t("SEARCH TERM")}</label>
                <input className="custom_input" id="id_search" name="search" type="text" value={searchTermTemp}
                       onChange={e => setSearchTermTemp(e.target.value)}/>
            </div>

            <div className="input_wrapper">
                <label htmlFor="id_group">{t("GROUP")}</label>
                <AutoInput
                    language={filters.dataLanguage}
                    name="group"
                    url={apiPathGroups}
                    value={filters.group}
                    setValue={(value) => {
                        setFilters({group: value})
                    }}
                />
            </div>

            {/*<div className="input_wrapper">*/}
            {/*    <button>{t("SHOW TREE ▼")}</button>*/}
            {/*</div>*/}

            {/*<div className="input_wrapper">*/}
            {/*    <label htmlFor="id_filename">{t("FILENAME")}</label>*/}
            {/*    <input id="id_filename" name="filename" type="text"/>*/}
            {/*</div>*/}

            {/*<div className="input_wrapper">*/}
            {/*    <button>{t("FILENAME TREE")}</button>*/}
            {/*</div>*/}

            <div className="input_wrapper">
                <label htmlFor="id_state">{t("STATE")}</label>
                <select id="id_state" name="state" value={filters.state}
                        onChange={e => setFilters({state: e.target.value})}>
                    <option value=""></option>
                    {
                        statusItems.map((item, i) => <option key={i} value={item.value}>{item.title}</option>)
                    }
                </select>
            </div>

            <div className="input_wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>{t('Status')}</th>
                        <th>{t('Count')}</th>
                        <th>{t('Total')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        statusItems.map((item, i) => <tr className={i % 2 ? "even" : "odd"} key={i}>
                            <td>{item.title}</td>
                            <td>{item.value && aggregations[item.value] ? aggregations[item.value][0] : 0}</td>
                            <td>{item.value && aggregations[item.value] ? aggregations[item.value][1] : 0}</td>
                        </tr>)
                    }
                    </tbody>
                </table>


                {/*<Chart*/}
                {/*    width={'100%'}*/}
                {/*    height={'300px'}*/}
                {/*    backgroundColor={'black'}*/}
                {/*    chartType="PieChart"*/}
                {/*    loader={<div>Loading Chart</div>}*/}
                {/*    data={[*/}
                {/*        ['Task', 'Hours per Day'],*/}
                {/*        [t('New'), 11],*/}
                {/*        [t('To do'), 2],*/}
                {/*        [t('Ready to review'), 2],*/}
                {/*        [t('Needs work'), 2],*/}
                {/*        [t('Accepted'), 7],*/}
                {/*    ]}*/}
                {/*    // options={{*/}
                {/*    //     title: 'My Daily Activities',*/}
                {/*    // }}*/}
                {/*    rootProps={{'data-testid': '1'}}*/}
                {/*/>*/}
            </div>


            {/*<div className="input_wrapper">*/}
            {/*    <button>{t("SAVE")}</button>*/}
            {/*    <button>{t("LOAD")}</button>*/}
            {/*    <button>{t("RESET")}</button>*/}

            {/*    <p>SAVE/LOAD/RESET STATE?</p>*/}
            {/*    <button>{t("YES")}</button>*/}
            {/*    <button>{t("NO")}</button>*/}
            {/*</div>*/}
        </section>
    )
}


export default SidePane;
