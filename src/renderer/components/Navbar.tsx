import React from 'react';

// Import components
import NavbarItem from './NavbarItem';
// Import app reference
import { App } from '../App';

type NavbarProps = {
    app: App,
    tabs: string[]
}

export default class Navbar extends React.Component<NavbarProps> {
    isTabSelected(tabName: string): boolean {
        return this.props.app.state.selectedTab === tabName;
    }

    selectTab(tabName: string) {
        this.props.app.setState({
            ...this.props.app.state,
            selectedTab: tabName
        });
    }

    render() {
        return (<div id="navbar">
            <NavbarItem isLogo={true} label="<messy-desk>" />
            {this.props.tabs.map(tabName => (
                <NavbarItem isSelected={this.isTabSelected(tabName)} onClick={(e) => this.selectTab(tabName)} label={tabName} />
            ))}
        </div>)
    }
}