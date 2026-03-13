import { createBrowserRouter, Outlet } from "react-router";
import {
  HomePage,
  CardPage,
  MemberAccessPage,
  DropPage,
  ThankYouPage,
  AboutPage,
  InstrumentPage,
  ForgePage,
} from "./components/pages";
import { Toaster } from "./components/ui/sonner";

// Root layout with Toaster
function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "card", Component: CardPage },
      { path: "about", Component: AboutPage },
      { path: "access", Component: MemberAccessPage },
      { path: "access/:token", Component: MemberAccessPage },
      { path: "drop/:id", Component: DropPage },
      { path: "thank-you", Component: ThankYouPage },
      { path: "instrument", Component: InstrumentPage },
      { path: "forge", Component: ForgePage },
    ],
  },
]);
