// eslint-disable @typescript-eslint/no-unused-vars
let renderCount = 0;

const logger = Object.freeze({
  logs: [] as string[],
  log: (message?: any, ...optionalParams: any[]) => {
    logger.logs.push(message);
    optionalParams.forEach((param) => {
      logger.logs.push(param);
    });
    console.log(message, ...optionalParams);
  },
  warn(message?: any, ...optionalParams: any[]) {
    logger.logs.push(message);
    optionalParams.forEach((param) => {
      logger.logs.push(param);
    });
    console.warn(message, ...optionalParams);
  },
  error(message?: any, ...optionalParams: any[]) {
    logger.logs.push(message);
    optionalParams.forEach((param) => {
      logger.logs.push(param);
    });
    console.error(message, ...optionalParams);
  },
  render: (componentName: string) => {
    console.log(`${renderCount++} Rendering ${componentName}`);
  },
});

export default logger;
