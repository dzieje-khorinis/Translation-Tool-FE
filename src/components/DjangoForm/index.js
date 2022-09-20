import { Component, createRef } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { apiClient } from '../../common/apiClient';

class DjangoForm extends Component {
  constructor(props) {
    super(props);

    const refs = {};
    props.fields.forEach((field) => {
      refs[field.id] = createRef();
    });

    this.state = {
      refs,
      errors: {},
      processing: false,
      redirecting: false,
    };
  }

  onSubmit = (event) => {
    const { apiMethod, apiUrl, successCallback, failCallback } = this.props;
    const { state } = this;

    event.preventDefault();
    const formData = {};
    Object.entries(state.refs).forEach(([key, value]) => {
      formData[key] = value.current.value;
    });
    this.setState({ processing: true });
    apiClient[apiMethod](apiUrl, formData).then(({ status, data }) => {
      this.setState({ processing: false });
      if (status === 200) {
        this.setState({ redirecting: true });
        successCallback(data);
      } else {
        this.setState({ errors: data });
        failCallback();
      }
    });
  };

  render() {
    const { title, redirectUrl, fields, submitName } = this.props;
    const { redirecting, errors, refs, processing } = this.state;

    return (
      <section className="form_section">
        <div className="form_wrapper">
          <h2>{title}</h2>

          {redirectUrl && redirecting ? (
            <Redirect push to={redirectUrl} />
          ) : null}

          {errors.non_field_errors && (
            <div className="errors">
              {errors.non_field_errors.map((error) => (
                <p className="error">{error}</p>
              ))}
            </div>
          )}

          <form method="post" onSubmit={this.onSubmit}>
            {fields.map((field) => {
              return (
                <div className="input_wrapper">
                  <label htmlFor={`id_${field.id}`}>{field.title}:</label>
                  {field.tag === 'input' && (
                    <input
                      id={`id_${field.id}`}
                      name={field.id}
                      type={field.type || 'text'}
                      required={field.required}
                      ref={refs[field.id]}
                      autoComplete={field.autoComplete}
                    />
                  )}
                  {field.tag === 'select' && (
                    <select
                      name={field.id}
                      id={`id_${field.id}`}
                      ref={refs[field.id]}
                    >
                      {field.options.map((option) => (
                        <option value={option.value}>{option.title}</option>
                      ))}
                    </select>
                  )}
                  {errors[field.id] &&
                    errors[field.id].map((error) => (
                      <p className="error">{error}</p>
                    ))}
                </div>
              );
            })}

            <div className="input_wrapper">
              {processing ? (
                <div className="spinner" />
              ) : (
                <input
                  className="form_submit"
                  type="submit"
                  value={submitName}
                />
              )}
            </div>
          </form>
        </div>
      </section>
    );
  }
}

DjangoForm.defaultProps = {
  successCallback: () => {},
  failCallback: () => {},
  apiMethod: 'post',
  redirectUrl: '',
};

DjangoForm.propTypes = {
  fields: PropTypes.arrayOf({
    id: PropTypes.number.isRequired,
  }).isRequired,
  successCallback: PropTypes.func,
  failCallback: PropTypes.func,
  apiMethod: PropTypes.string,
  apiUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  submitName: PropTypes.string.isRequired,
};

export default DjangoForm;
