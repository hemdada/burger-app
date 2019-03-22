import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from  './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {

    state = {
       isFormValid : false,
       orderForm: {
           name: {
               elementType: 'input',
               elementConfig: {
                   type : 'text',
                   placeholder: 'Your Name'
               },
               value: '',
               validation: {
                   required : true
               },
               valid: false,
               touched: false
           },
           street:{
               elementType: 'input',
               elementConfig: {
                   type : 'text',
                   placeholder: 'Street'
               },
               value: '',
               validation: {
                   required : true
               },
               valid: false,
               touched: false
           },
           zipcode:{
               elementType: 'input',
               elementConfig: {
                   type : 'text',
                   placeholder: 'Zip Code'
               },
               value: '',
               validation: {
                   required : true,
                   minLength: 5,
                   maxLength: 5
               },
               valid: false,
               touched: false
           },
           country:{
               elementType: 'input',
               elementConfig: {
                   type : 'text',
                   placeholder: 'Country'
               },
               value: '',
               validation: {
                   required : true
               },
               valid: false,
               touched: false
           },
           email:{
               elementType: 'input',
               elementConfig: {
                   type : 'email',
                   placeholder: 'Your E-mail'
               },
               value: '',
               validation: {
                   required : true
               },
               valid: false,
               touched: false
           },
           deliveryMethod : {
               elementType: 'select',
               elementConfig: {
                   options: [
                       {value: 'fastest', displayValue: 'Fastest'},
                       {value: 'cheapest', displayValue: 'Cheapest'}
                   ]
               },
               value: 'cheapest',
               validation: {},
               valid: true
           }
       }
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

        return isValid;
    }
    orderHandler = (event) => {
        event.preventDefault();
        const formData = {}
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        };
        this.setState({loading: true});
        axios.post('orders.json', order).then(response => {
            console.log(response);
            this.setState({loading: false});
            this.props.history.push('/');
        }).catch(error => {
            this.setState({loading: false});
            console.log(error);
        });
    };

    inputChangedHandler = (event, inputIdentifier) => {
      const updateOrderForm = {
          ...this.state.orderForm
      };
      const updateFormElement = {
          ...updateOrderForm[inputIdentifier]
      };
      updateFormElement.value = event.target.value;
      updateFormElement.valid = this.checkValidity(updateFormElement.value, updateFormElement.validation);
      updateFormElement.touched = true;
      updateOrderForm[inputIdentifier] = updateFormElement;

      let isFormValid = true;

      for(let inputIdentifier in updateOrderForm) {
          isFormValid = updateOrderForm[inputIdentifier].valid && isFormValid;
      }

      console.log(updateFormElement);
      this.setState({orderForm : updateOrderForm, isFormValid: isFormValid});
    };

    render() {
        const formElementArray = [];
         for (let key in this.state.orderForm) {
             formElementArray.push({
                 id : key,
                 config: this.state.orderForm[key]
             });
         }
        let form = (
            <form onSubmit={this.orderHandler}>

                {formElementArray.map(formElement => (
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
                ))}
                <Button btnType="Success" disabled={!this.state.isFormValid}>ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form =<Spinner/>;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter Contact Data</h4>
                {form}

            </div>
        )
    }

}

export default ContactData;