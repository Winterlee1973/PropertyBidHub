import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import PropertyDetail from "@/pages/property-detail";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import Header from "@/components/header";
import Footer from "@/components/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/properties" component={LayoutWithHeaderFooter(HomePage)} />
      <Route path="/auth" component={LayoutWithHeaderFooter(AuthPage)} />
      <Route path="/property/:id" component={LayoutWithHeaderFooter(ProtectedPropertyDetail)} />
      <Route component={LayoutWithHeaderFooter(NotFound)} />
    </Switch>
  );
}

// Wrap PropertyDetail with ProtectedRoute
function ProtectedPropertyDetail() {
  return <ProtectedRoute path="/property/:id" component={PropertyDetail} />;
}

// HOC to wrap components with Header and Footer
function LayoutWithHeaderFooter(Component: React.ComponentType) {
  return function WrappedComponent(props: any) {
    return (
      <>
        <Header />
        <main className="flex-grow">
          <Component {...props} />
        </main>
        <Footer />
      </>
    );
  };
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Router />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
