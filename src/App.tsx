import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { CatalogPage } from "@/pages/catalog-page";
import { ManagePage } from "@/pages/manage-page";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
