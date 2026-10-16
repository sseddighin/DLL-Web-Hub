// GitHub project Pages lives beneath the repository name, not the origin root.
export const basePath = process.env.BASE_PATH || "/DLL-Web-Hub/";
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(basePath)) {
  throw new Error(
    "BASE_PATH must be an absolute directory path with a trailing slash (for example /DLL-Web-Hub/ or /).",
  );
}
