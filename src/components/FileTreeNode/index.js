import "./style.scss"
import React, {useState} from "react";
import {apiClient} from "../../common/apiClient";
import PropTypes from "prop-types";


function FileTreeNode({data, getChildrenUrl, depth, filters, setFilters}) {
    const [opened, setOpened] = useState(false)
    const [opening, setOpening] = useState(false)
    const [children, setChildren] = useState([])


    function select() {
        if (filters.path === data.path) {
            setFilters({path: ""})
        } else {
            setFilters({path: data.path})
        }
    }

    function open() {
        if (opened) {
            setOpened(false)
            return
        }

        if (children.length) {
            setOpened(true)
            return
        }

        setOpening(true)
        let childrenUrl = getChildrenUrl(data.id)
        apiClient.get(childrenUrl).then(({status, data}) => {
            setChildren(data)
            setOpening(false)
            setOpened(true)
        })

    }

    let nodeArrowClass = "nodeArrow"

    let nodeArrowSymbol = "↓";
    if (opening) {
        nodeArrowSymbol = "↻"
        nodeArrowClass = `${nodeArrowClass} rotating`
    } else if (opened) {
        nodeArrowSymbol = "↑"
    }

    let nodeTypeSymbol = "📄"
    if (!data.leaf) {
        nodeTypeSymbol = opened ? "📂" : "📁"
    }

    let nodeSelectClass = "nodeSelect"
    if (filters.path === data.path) {
        nodeSelectClass = `${nodeSelectClass} selected`
    }

    return (
        <div className="treeNode" style={{marginLeft: depth * 10}}>
            <p className="treeRoot">
                <span onClick={(e) => {
                    open()
                }}>
                    {
                        !data.leaf &&
                        <span className={nodeArrowClass}>{nodeArrowSymbol}</span>
                    }
                    <span className="nodeType">{nodeTypeSymbol}</span>
                    <span className="nodeName">{data.name}</span>
                </span>
                <span className={nodeSelectClass} onClick={(e) => {
                    select()
                }}>✔</span>
            </p>
            {
                opened &&
                children.map((item, i) => <FileTreeNode
                    key={i}
                    data={item}
                    getChildrenUrl={getChildrenUrl}
                    depth={depth + 1}
                    filters={filters}
                    setFilters={setFilters}
                />)
            }
        </div>
    )
}


FileTreeNode.propTypes = {
    data: PropTypes.object.isRequired,
    getChildrenUrl: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    depth: PropTypes.number.isRequired,
}
export default FileTreeNode;
