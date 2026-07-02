export const getRoutes = (app) => {
  const routes = [];

  const stack = app.router?.stack || [];

  const getBasePath = (layer) => {
    const match = layer.regexp
      .toString()
      .replace("/^\\", "")
      .replace("\\/?(?=\\/|$)/i", "")
      .replace(/\\\//g, "/")
      .replace(/\^|\$/g, "");

    return match === "/" ? "" : match;
  };

  const traverse = (stack, basePath = "") => {
    stack.forEach((layer) => {
      // CASE 1: actual route
      if (layer.route && layer.route.path) {
        const path = basePath + layer.route.path;

        Object.keys(layer.route.methods).forEach((method) => {
          routes.push({
            method: method.toUpperCase(),
            path,
          });
        });
      }

      // CASE 2: nested router
      if (layer.name === "router" && layer.handle?.stack) {
        const base = basePath + getBasePath(layer);

        traverse(layer.handle.stack, base);
      }
    });
  };

  traverse(stack);

  return routes;
};
