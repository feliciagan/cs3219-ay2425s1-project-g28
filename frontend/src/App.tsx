import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NewQuestion from "./pages/NewQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import QuestionEdit from "./pages/QuestionEdit";
import PageNotFound from "./pages/PageNotFound";
import QuestionList from "./pages/QuestionList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="questions">
            <Route index element={<QuestionList />} />
            <Route path="new" element={<NewQuestion />} />
            <Route path=":questionId" element={<QuestionDetail />} />
            <Route path=":questionId/edit" element={<QuestionEdit />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
