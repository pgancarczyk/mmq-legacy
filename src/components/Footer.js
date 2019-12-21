import React, {Component} from 'react'

class Footer extends Component {
    render() {
        return(
            <footer className="text-muted">
                <div className="container">
                    <p className="float-right">
                        <a href="#" className="text-info">w górę</a>
                    </p>
                    <p>Stworzono w 2019 roku w Krakowie jako element pracy inżynierskiej.</p>
                </div>
            </footer>
        )
    }
}

export default Footer;