export const validationGuard = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        message: "invalid input",
        errors: result.error.issues.map((issue) => issue.message),
      },
      400,
    );
  }
};
