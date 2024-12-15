import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import config from "./config.ts";
import { ConfigProvider } from "antd";
import store from "./store/index";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider theme={config}>
      <Toaster containerStyle={{ zIndex: '999999999999999999' }} />
      
        <App />
     
    </ConfigProvider>
  </Provider>
);
