import React, { Component } from 'react';
import notFound from '../../assets/img/sad-face-clipart-lg.png';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state to indicate an error has occurred
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Error caught:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh' ,
                    backgroundColor: '#ffffff'
                }}>
                    <img src={notFound} style={{ width: '150px'}} />
                    <h1 style={{marginBottom: '20px', textAlign: 'center'}}>Something went wrong.</h1>
                    <details>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
