export default async (server) => {
  let response = {};

  if (server) {
    try {
      const resp = await fetch(
        `https://fediverse-info.stefanbohacek.com/node-info?domain=${server}&full=true`,
      );
      response = await resp.json();
    } catch (error) {
      // noop
    }
  }

  return response;
};
