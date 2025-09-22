import MainLayout from "@/components/layout/mainLayout";
import { createRootRoute, Outlet, useMatchRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const hideNavRoutes = ["/login"];
  const matchRoute = useMatchRoute();

  const matchedHideSideBarRoutes = hideNavRoutes.some((route) =>
    matchRoute({ to: route })
  );

  const content = (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );

  return matchedHideSideBarRoutes ? (
    content
  ) : (
    <MainLayout>{content}</MainLayout>
  );
}
