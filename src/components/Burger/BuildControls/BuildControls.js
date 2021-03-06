import React from 'react';
import classes from "./BuildControls.css";
import BuildControl from './BuildControl/BuildControl';
const controls = [
    {label: 'Salad', type : 'salad'},
    {label: 'Cheese', type : 'cheese'},
    {label: 'Bacon', type : 'bacon'},
    {label: 'Meat', type : 'meat'}
];

const buildControls = (props) => {
    return (
        <div className={classes.BuildControls}>
            <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
            {
                controls.map(ctrl => (
                    <BuildControl
                        added={ () => props.ingredientAdded(ctrl.type)}
                        removed={ () => props.ingredientRemoved(ctrl.type)}
                        disabled = {props.disabled[ctrl.type]}
                        key={ctrl.label}
                        label={ctrl.label}
                        type={ctrl.type} />
                ))
            }
            <button disabled={!props.purchasable} onClick={props.ordered} className={classes.OrderButton}>{props.isAuth ? "ORDER NOW" : "ORDER TO SINGUP"}</button>
        </div>
    );
};

export default buildControls;