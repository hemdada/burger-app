import React, {Component} from 'react';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css'
import {Redirect} from 'react-router-dom';
import * as actions from '../../store/actions/index';
import {connect} from "react-redux";
class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type : 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required : true,
                    isEmail : true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type : 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required : true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: false
    };

    checkValidity (value, rules) {
        let isValid = true;

        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if (rules.isEmail) {
            const pattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }


    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== "/") {
            this.props.onSetAuthRedirectPath();
        }
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    };

    authModeHandler = (prevState) => {
        this.setState(prevState => { return {isSignUp : !prevState.isSignUp}});
    };

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName] : {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        this.setState({controls : updatedControls});
    };
    render() {
        const formElementArray = [];
        for (let key in this.state.controls) {
            formElementArray.push({
                id : key,
                config: this.state.controls[key]
            });
        }
        let form = formElementArray.map(formElement => (
                    <Input
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        key={formElement.id}
                        invalid={!formElement.config.valid}
                        shouldValidate = {formElement.config.validation}
                        touched = {formElement.config.touched}
                        changed={ (event) => this.inputChangedHandler(event, formElement.id)}
                    />
                ));
        if (this.props.loading) {
            form = <Spinner/>
        }
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = <p>{this.props.error.message}</p>
        }

        let authRedirect = null;

        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button clicked={this.authModeHandler} btnType="Danger">SWITCH T0 {this.state.isSignUp ? "SIGN UP" : "SIGN IN" }</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
};

const mapDisptachToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp)=> dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath : () => dispatch(actions.setAuthRedirectPath("/"))
    }
};
export default connect(mapStateToProps, mapDisptachToProps)(Auth);