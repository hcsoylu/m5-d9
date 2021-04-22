export const error400Handler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res.status(400).send("Bad request!");
  }
  next(err);
};

export const error404Handler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res.status(404).send("page not found!");
  }
  next(err);
};

export const error401Handler = (err, req, res, next) => {
  if (err.httpStatusCode === 401) {
    res.status(401).send("Unauthorized, you're not able do this action!");
  }
  next(err);
};

export const error403Handler = (err, req, res, next) => {
  if (err.httpStatusCode === 403) {
    res.status(403).send("You're forbidden to do this action!");
  }
  next(err);
};

export const genericErrorHandler = (err, req, res, next) => {
  if (!res.headersSent) {
    res.status(err.httpStatusCode || 500).send(err);
  }
  next(err);
};
