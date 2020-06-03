import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';


class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    isSignUp: true
  }

  static checkValidity(value, rules) { // Static method
    let isValid = true;

    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      /* eslint-disable-next-line */
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  inputChangeHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: Auth.checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  onSubmitHandler = event => {
    event.preventDefault();
    if(this.state.controls.email.valid && this.state.controls.email.valid){
      this.props.onAuthentication(
        this.state.controls.email.value,
        this.state.controls.password.value,
        this.state.isSignUp);
    }
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignUp: !prevState.isSignUp };
    });
  }


  render() {
    let formElementsArray = [];

    for (const controlName in this.state.controls) {
      if (this.state.controls.hasOwnProperty(controlName)) {
        formElementsArray.push(
          {
            id: controlName,
            config: this.state.controls[controlName]
          }
        );
      }
    }

    let form = (
      formElementsArray.map(formElement => (
        <Input
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          key={formElement.id}
          fieldName={formElement.id}
          notValid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={event => this.inputChangeHandler(event, formElement.id)}/>
      ))
    );

    if(this.props.load){
      form = <Spinner/>;
    }

    let errorMessage = null;
    if(this.props.err) {
      errorMessage = <p>{this.props.err.response.data.error.message}</p>;
    }

    let redirectAuth = null;
    if(this.props.isAuth){
      redirectAuth = <Redirect to='/'/>;
    }

    return (
      <div className={classes.Auth}>
        {redirectAuth}
        {errorMessage}
        <form onSubmit={event => this.onSubmitHandler(event)}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button
          clicked={this.switchAuthModeHandler}
          btnType="Danger">{this.state.isSignUp ?
            'SWITCH TO SIGN IN' :
            'SWITCH TO SIGN UP'}</Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    load: state.auth.loading,
    err: state.auth.error,
    isAuth: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* eslint-disable-next-line */
    onAuthentication: (email, password, isSignUp) => dispatch(actions.authentication(email, password, isSignUp))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
