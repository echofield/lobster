import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout";
import {
  HomePage,
  CardPage,
  MemberAccessPage,
  DropPage,
  ThankYouPage,
  AboutPage,
} from "./components/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // Main Pages
      { index: true, Component: HomePage },
      { path: "card", Component: CardPage },
      { path: "about", Component: AboutPage },

      // Member Flow (NFC tap → access)
      { path: "access", Component: MemberAccessPage },
      { path: "access/:token", Component: MemberAccessPage },

      // Drop Detail
      { path: "drop/:id", Component: DropPage },

      // Purchase Flow
      { path: "thank-you", Component: ThankYouPage },

      // Legal (placeholder - can reuse AboutPage pattern)
      { path: "terms", Component: AboutPage },
      { path: "privacy", Component: AboutPage },
      { path: "faq", Component: AboutPage },
    ],
  },
]);
