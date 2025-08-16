export const handleErrors = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
};

export const handleNotFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};
