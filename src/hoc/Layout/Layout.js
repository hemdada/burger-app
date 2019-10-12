import React, {Component} from 'react';
import Aux from '../Aux/Aux';
import classes from './Layout.css';
import {connect} from 'react-redux';
import Toobar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
      showSideDrawer: false
    };

    sideDrawerCloseHanlder = () => {
        this.setState({showSideDrawer: false});
    };

    sideDrawerToggleHandler = () => {
      this.setState((prevState) => {
          return {showSideDrawer : !prevState.showSideDrawer}
      })
    };

    render() {
        return (
            <Aux>
                <Toobar isAuth={this.props.isAuthenticated} drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer isAuth={this.props.isAuthenticated} open={this.state.showSideDrawer} closed={this.sideDrawerCloseHanlder}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}

const mapStateToProps=  state => {
    return {
        isAuthenticated : state.auth.token !==null
    }
};

export default connect(mapStateToProps)(Layout);