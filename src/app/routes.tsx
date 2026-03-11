import { createBrowserRouter } from "react-router";
import {
  HomePage,
  CardPage,
  MemberAccessPage,
  DropPage,
  ThankYouPage,
  AboutPage,
} from "./components/pages";
import { Toaster } from "./components/ui/sonner";

// Simple wrapper that just adds the Toaster
function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

export const router = createBrowserRouter([
  // All pages handle their own layout
  { path: "/", element: <AppWrapper><HomePage /></AppWrapper> },
  { path: "/card", element: <AppWrapper><CardPage /></AppWrapper> },
  { path: "/about", element: <AppWrapper><AboutPage /></AppWrapper> },
  { path: "/access", element: <AppWrapper><MemberAccessPage /></AppWrapper> },
  { path: "/access/:token", element: <AppWrapper><MemberAccessPage /></AppWrapper> },
  { path: "/drop/:id", element: <AppWrapper><DropPage /></AppWrapper> },
  { path: "/thank-you", element: <AppWrapper><ThankYouPage /></AppWrapper> },
]);
