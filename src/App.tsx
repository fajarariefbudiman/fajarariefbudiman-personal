import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { useState, useEffect } from "react";
import AutoChartGenerator from "./pages/AutoChartGenerator";

const queryClient = new QueryClient();

const App = () => {
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("visited");
    if (hasVisited) setVisited(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* {!visited ? (
          <WelcomeScreen onFinish={() => setVisited(true)} />
        ) : ( */}
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route
              path='/portfolio/auto-chart-generator'
              element={<AutoChartGenerator />}
            />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* )} */}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
