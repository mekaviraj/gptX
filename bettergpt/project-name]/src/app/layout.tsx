import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="layout">
            <header>
                <h1>My Application</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>© 2023 My Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;