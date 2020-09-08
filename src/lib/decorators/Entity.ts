export function Entity(): ClassDecorator {
  return function (hello) {
    console.log("Hello from the entity");
  };
}
