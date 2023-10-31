export const errorHandler = (err, req, res, next) => {
  if (err.isAxiosError) {
    return res.status(400).json({
      errors: [{ msg: err.response.data.message }],
    });
  } else if (err.errors) {
    const errs = err.errors.map((e) => ({ msg: e.msg }));
    return res.status(422).json({
      errors: errs,
    });
  }

  res.status(err.status || 400).json({
    errors: [{ msg: err.message }],
  });
};
