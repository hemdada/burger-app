import React, {Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from  '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from  '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from  '../../hoc/withErrorHandler/withErrorHandler';

import {connect } from 'react-redux';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        /*axios.get("https://react-my-burger-68c50.firebaseio.com/ingredients.json").then(response => {
            this.setState({ingredients : response.data})
        }).catch(error => {
            this.setState({error : true});
        })*/
    }

    updatePurchasable (ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => {
              return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        return sum > 0;
    }

    purchasehandler = () => {
      this.setState({purchasing: true});
    };

    cancelPurchasehandler = () => {
        this.setState({purchasing: false});
    };

    continuePurchasehandler = () => {
        this.props.history.push('/checkout');
    };



    render() {
        const disabledInfo = {...this.props.ings};
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
        let burger = this.state.error ? "Ingredients can't be loaded" : <Spinner/>;

        if (this.props.ings) {
            burger = (<Aux><Burger ingredients={this.props.ings}/>
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    price={this.props.price}
                    purchasable={this.updatePurchasable(this.props.ings)}
                    ordered={this.purchasehandler}
                /></Aux>);
            orderSummary = <OrderSummary
                purchaseCancelled = {this.cancelPurchasehandler}
                purchaseContinue = {this.continuePurchasehandler}
                price =  {this.props.price}
                ingredients={this.props.ings}/>;
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.cancelPurchasehandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
};

const mapDispatchToRops = (dispatch) => {
    return {
        onIngredientAdded : (ingName) => dispatch({type : actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved : (ingName) => dispatch({type : actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    };
};

export default connect(mapStateToProps, mapDispatchToRops)(withErrorHandler(BurgerBuilder, axios));

