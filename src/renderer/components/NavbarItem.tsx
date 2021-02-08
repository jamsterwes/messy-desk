import React from 'react';

type NavbarItemProps = {
    isLogo?: boolean,
    isSelected?: boolean,
    label: string,
    onClick?: (event: React.MouseEvent) => void
}

export default class NavbarItem extends React.Component<NavbarItemProps> {
    getClassName(): string {
        let baseName = "nav-item";
        if (this.props.isLogo) {
            baseName += " logo-text";
        }
        if (this.props.isSelected) {
            baseName += " selected";
        }
        return baseName;
    }

    render() {
        return (<div className={this.getClassName()} onClick={this.props.onClick}>
            {this.props.label}
        </div>)
    }
}