test('Should work at least 10s', async () => {
  await import('../src/index');
  await new Promise((resolve) => {
    setTimeout(resolve, 10000);
  });
}, 20000);
