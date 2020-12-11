const createFunction = <F extends Function>(name: string, body: F): F => {
	try {
		window;
	} catch {
		// @ts-ignore
		self.window = self;
	}
  // @ts-ignore
  window.temp = body;
  const func = new Function(
    `
		const body = window.temp;
		return function ${name}(...args) {
			return body(...args)
		}
		`
  )();
  return func;
};

export { createFunction };
