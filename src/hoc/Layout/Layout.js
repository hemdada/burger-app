import React, {Component} from 'react';
import Aux from '../Aux/Aux';
import classes from './Layout.css';
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
                <Toobar drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerCloseHanlder}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}

export default Layout;