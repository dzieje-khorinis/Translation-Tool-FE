import {Component, createRef} from "react";
import {Redirect} from "react-router-dom";
import {apiClient} from "../../common/apiClient";
import PropTypes from "prop-types";


class DjangoForm extends Component {
    constructor(props) {
        super(props);

        let refs = {}
        props.fields.forEach((field) => {
            refs[field.id] = createRef()
        })

        this.state = {
            refs: refs,
            values: {},
            errors: {},
            processing: false,
            redirecting: false,
        }
    }

    onSubmit = (event) => {
        event.preventDefault()
        let formData = {}
        for (const [key, value] of Object.entries(this.state.refs)) {
            formData[key] = value.current.value
        }
        this.setState({processing: true})
        apiClient[this.props.apiMethod](this.props.apiUrl, formData).then(({status, data}) => {
            this.setState({processing: false})
            if (status === 200) {
                this.setState({redirecting: true})
                this.props.successCallback(data)
            } else {
                this.setState({errors: data})
                this.props.failCallback()
            }
        })
    }

    render() {
        return <section className="form_section">
            <div className="form_wrapper">
                <h2>{this.props.title}</h2>

                {this.props.redirectUrl && this.state.redirecting ? (<Redirect push to={this.props.redirectUrl}/>) : null}

                {
                    this.state.errors.non_field_errors &&
                    <div className="errors">
                        {this.state.errors.non_field_errors.map((error, i) => <p key={i} className="error">{error}</p>)}
                    </div>
                }

                <form method="post" onSubmit={this.onSubmit}>
                    {
                        this.props.fields.map((field, i) => {
                            return <div key={i} className="input_wrapper">
                                <label htmlFor={`id_${field.id}`}>{field.title}:</label>
                                {
                                    field.tag === "input" &&
                                    <input id={`id_${field.id}`} name={field.id} type={field.type || "text"} required={field.required}
                                           ref={this.state.refs[field.id]} autoComplete={field.autoComplete}/>
                                }
                                {
                                    field.tag === "select" &&
                                    <select name={field.id} id={`id_${field.id}`} ref={this.state.refs[field.id]}>
                                        {
                                            field.options.map((option, i) => <option key={i}
                                                value={option.value}>{option.title}</option>)
                                        }
                                    </select>
                                }
                                {
                                    this.state.errors[field.id] &&
                                    this.state.errors[field.id].map((error, i) => <p key={i}
                                                                                     className="error">{error}</p>)
                                }
                            </div>
                        })
                    }

                    <div className="input_wrapper">
                        {
                            this.state.processing
                                ? <div className="spinner"></div>
                                : <input className="form_submit" type="submit" value={this.props.submitName}/>
                        }
                    </div>
                </form>
            </div>
        </section>
    }
}

DjangoForm.defaultProps = {
    successCallback: (data) => {
    },
    failCallback: () => {
    },
    apiMethod: "post",
}

DjangoForm.propTypes = {
    fields: PropTypes.array,
    successCallback: PropTypes.func,
    failCallback: PropTypes.func,
}

export default DjangoForm