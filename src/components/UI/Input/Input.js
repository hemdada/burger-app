import React from 'react';
import classes from './Input.css';

const input = (props) => {
    let inputElement;
    const classesArray = [classes.InputElement];
    if (props.invalid && props.shouldValidate && props.touched) {
        classesArray.push(classes.Invalid);
    }
    switch (props.elementType) {

        case ('input'):
            inputElement = <input
                className={classesArray.join(' ')}
                {...props.elementConfig}
                onChange={props.changed}
                value={props.value}
            />;
            break;
        case ('textarea'):
            inputElement = <textarea
                className={classesArray.join(' ')}
                {...props.elementConfig}
                onChange={props.changed}
                value={props.value}
             />;
            break;
        case ('select'):
            inputElement =
                (<select className={classesArray.join(' ')} value={props.value} onChange={props.changed} >
                     {props.elementConfig.options.map(option =>
                         (<option key={option.value} value={option.value}>
                             {option.displayValue}
                         </option>)
                     )}
                 </select>);
            break;
        default:
            inputElement = <input
                className={classesArray.join(' ')}
                onChange={props.changed}
                {...props.elementConfig}
            />;
    }
    return (
        <div className={classes.Input}>
            <label>{props.label}</label>
            {inputElement}
        </div>
    );
};

export default input;

