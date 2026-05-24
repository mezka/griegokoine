import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./shared/components/ErrorBoundary.jsx";
import { ProveedorDeEstudio } from "./state/ProveedorDeEstudio.jsx";
import Home from "./pages/Home.jsx";
import EstudiarAlfabetoGriego from "./features/alfabeto/EstudiarAlfabetoGriego.jsx";
import JuanLayout from "./features/juan/JuanLayout.jsx";
import ReadingView from "./features/juan/views/ReadingView.jsx";
import PracticeMode from "./features/juan/practice/PracticeMode.jsx";
import GlossaryView from "./features/juan/views/GlossaryView.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <ProveedorDeEstudio>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alfabeto" element={<EstudiarAlfabetoGriego />} />
          <Route path="/juan" element={<JuanLayout />}>
            <Route index element={<Navigate to="lectura" replace />} />
            <Route path="lectura" element={<ReadingView />} />
            <Route path="practica" element={<PracticeMode />} />
            <Route path="glosario" element={<GlossaryView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProveedorDeEstudio>
    </ErrorBoundary>
  );
}
