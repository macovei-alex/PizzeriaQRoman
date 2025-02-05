const logger = Object.freeze({
  log: (message?: any, ...optionalParams: any[]) => {
    console.log(message, ...optionalParams);
  },
  warn(message?: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  },
  error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  },
  render: (componentName: string) => {
    // console.log(`Rendering ${componentName}`);
  },
});

export default logger;
