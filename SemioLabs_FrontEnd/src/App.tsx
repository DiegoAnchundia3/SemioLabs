import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import StudyPage from './pages/StudyPage';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/estudiar" element={<StudyPage />} />
        <Route path="/practicar" element={<PracticePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;