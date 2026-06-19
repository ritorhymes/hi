const { timingSafeEqual } = require("node:crypto");

function matches(candidate, expected) {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  return candidateBuffer.length === expectedBuffer.length && timingSafeEqual(candidateBuffer, expectedBuffer);
}

module.exports = function unlock(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Use POST to unlock this." });
  }

  const configuredPassword = process.env.PAGE_PASSWORD;
  const configuredMessage = process.env.SECRET_MESSAGE;

  if (!configuredPassword || !configuredMessage) {
    return response.status(503).json({ error: "The gate has not been configured yet." });
  }

  let body = request.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return response.status(400).json({ error: "That request was not valid." });
    }
  }

  if (!body || typeof body.password !== "string") {
    return response.status(400).json({ error: "Enter a password first." });
  }

  if (!matches(body.password, configuredPassword)) {
    return response.status(401).json({ error: "Nope. Try again." });
  }

  return response.status(200).json({ message: configuredMessage });
};
