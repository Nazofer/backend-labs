const statuses = ['working', 'done', 'pending', 'failed', 'error'];

export const getStatus = () => {
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return status;
}