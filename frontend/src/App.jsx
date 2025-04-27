import React, { useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Routing from "./routes/Routing.jsx";
import Toast from './components/Toast.jsx';
import { setToastHandler } from './utils/toastService'; // import

function App() {
    const [toastData, setToastData] = useState({ message: '', type: 'success', show: false });

    const handleShowToast = (message, type = "success") => {
        setToastData({ message, type, show: true });
        setTimeout(() => {
            setToastData(prev => ({ ...prev, show: false }));
        }, 1000);
    };

    // Set global handler on mount
    React.useEffect(() => {
        setToastHandler(handleShowToast);
    }, []);

    return (
      <BrowserRouter>
          <Navbar />
          <div className="pt-20">
              <Routing />
          </div>
          <Toast message={toastData.message} type={toastData.type} show={toastData.show} />
      </BrowserRouter>
    );
}

export default App;
