import logo from "./logo.svg";
import "./App.css";
import Post from "./post";
import Header from "./header";
import { Route, Routes } from "react-router-dom";
import Layout from "./layout";
import IndexPage from "./pages/indexpage";
import Login from "./pages/loginpage";
import Register from "./pages/registerpage";
import { UserContextProvider } from "./userContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faIconName } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/create"} element={<CreatePost />} />
          <Route path={"post/:id"} element={<PostPage />} />
          <Route path={"/edit/:id"} element={<EditPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
