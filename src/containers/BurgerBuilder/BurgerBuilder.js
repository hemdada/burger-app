import React, {Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from  '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from  '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from  '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3,
};

class BurgerBuilder extends Component {
    state = {
        ingredients : null,
        totalPrice : 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get("https://react-my-burger-68c50.firebaseio.com/ingredients.json").then(response => {
            this.setState({ingredients : response.data})
        }).catch(error => {
            this.setState({error : true});
        })
    }

    updatePurchasable (ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => {
              return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        this.setState({purchasable: sum > 0});
    }

    purchasehandler = () => {
      this.setState({purchasing: true});
    };

    cancelPurchasehandler = () => {
        this.setState({purchasing: false});
    };

    continuePurchasehandler = () => {
        //alert("Yes continue!");
/*        const order = {
          ingredients: this.state.ingredients,
          price: this.state.totalPrice,
          customer: {
              name : 'Hemanth',
              email: "test@test.com",
              address: {
                  street: "street1",
                  zipCode: '12443',
                  country: "India"
              }
          },
          deliveryMethod:'fastest'
        };
        this.setState({loading : true});
        axios.post('orders', order).then(response => {
            console.log(response);
            this.setState({loading : false, purchasing: false});
        }).catch(error => {
            this.setState({loading : false, purchasing: false});
            console.log(error);
        });*/

        const queryParams = [];

        queryParams.push("price="+ this.state.totalPrice);

        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }

        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname : '/checkout',
            search: '?' + queryString
        });
    };

    addIngredientsHanlder = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchasable(updatedIngredients);
    };

    removeIngredientsHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchasable(updatedIngredients);
    };

    render() {
        const disabledInfo = {...this.state.ingredients};
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
        let burger = this.state.error ? "Ingredients can't be loaded" : <Spinner/>;

        if (this.state.ingredients) {
            burger = (<Aux><Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded={this.addIngredientsHanlder}
                    ingredientRemoved={this.removeIngredientsHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchasehandler}
                /></Aux>);
            orderSummary = <OrderSummary
                purchaseCancelled = {this.cancelPurchasehandler}
                purchaseContinue = {this.continuePurchasehandler}
                price =  {this.state.totalPrice}
                ingredients={this.state.ingredients}/>;
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

export default withErrorHandler(BurgerBuilder, axios);

