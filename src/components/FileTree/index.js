import "./style.scss"
import {useEffect, useState} from "react";
import {apiClient} from "../../common/apiClient";
import FileTreeNode from "../FileTreeNode";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";


function FileTree({rootUrl, getChildrenUrl, filters, setFilters}) {
    const [rootData, setRootData] = useState()

    const {t} = useTranslation('common');

    useEffect(() => {
        apiClient.get(rootUrl).then(({status, data}) => {
            setRootData(data)
        })
    }, [rootUrl])

    return (
        <div className="tree">
            <p className="legend">{t('To select catalog use CTRL+CLICK')}</p>
            {
                rootData &&
                <FileTreeNode
                    data={rootData}
                    getChildrenUrl={getChildrenUrl}
                    filters={filters}
                    setFilters={setFilters}
                    depth={0}
                />
            }
        </div>
    )
}

FileTree.propTypes = {
    rootUrl: PropTypes.string.isRequired,
    getChildrenUrl: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
}
export default FileTree;
