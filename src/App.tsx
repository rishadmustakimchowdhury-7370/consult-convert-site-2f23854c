import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ServicePage from "./pages/services/ServicePage";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import PublicProjects from "./pages/Projects";
import Landing from "./pages/Landing";

// Admin Pages
import AdminAuth from "./pages/admin/AdminAuth";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import BlogList from "./pages/admin/blogs/BlogList";
import BlogEditor from "./pages/admin/blogs/BlogEditor";
import PageList from "./pages/admin/pages/PageList";
import PageEditor from "./pages/admin/pages/PageEditor";
import MediaManager from "./pages/admin/MediaManager";
import SEOTools from "./pages/admin/SEOTools";
import Settings from "./pages/admin/Settings";
import Categories from "./pages/admin/Categories";
import Testimonials from "./pages/admin/Testimonials";
import ServicesAdmin from "./pages/admin/Services";
import MenuManager from "./pages/admin/MenuManager";
import AdminProjects from "./pages/admin/Projects";
import ProjectEditor from "./pages/admin/ProjectEditor";
import SEOVerification from "./pages/admin/SEOVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/projects" element={<PublicProjects />} />
            <Route path="/landing" element={<Landing />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminAuth />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="services" element={<ServicesAdmin />} />
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/new" element={<BlogEditor />} />
              <Route path="blogs/:id" element={<BlogEditor />} />
              <Route path="categories" element={<Categories />} />
              <Route path="pages" element={<PageList />} />
              <Route path="pages/new" element={<PageEditor />} />
              <Route path="pages/:id" element={<PageEditor />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="menu" element={<MenuManager />} />
              <Route path="media" element={<MediaManager />} />
              <Route path="seo" element={<SEOTools />} />
              <Route path="seo-verification" element={<SEOVerification />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/new" element={<ProjectEditor />} />
              <Route path="projects/:id" element={<ProjectEditor />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;