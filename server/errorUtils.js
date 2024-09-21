// Utility to introduce random errors into strings
const introduceErrors = (string, errors) => {
  if (errors === 0) return string;
  let result = string.split("");

  const applyError = () => {
    const errorType = Math.floor(Math.random() * 3); // Random error: 0 - delete, 1 - add, 2 - swap
    const position = Math.floor(Math.random() * result.length);

    switch (errorType) {
      case 0:
        result.splice(position, 1); // Delete character
        break;
      case 1:
        result.splice(
          position,
          0,
          String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        ); // Add random character
        break;
      case 2:
        if (position < result.length - 1) {
          [result[position], result[position + 1]] = [
            result[position + 1],
            result[position],
          ]; // Swap characters
        }
        break;
    }
  };

  const fullErrors = Math.floor(errors);
  for (let i = 0; i < fullErrors; i++) applyError();

  if (Math.random() < errors % 1) applyError(); // Fractional error

  return result.join("");
};

module.exports = { introduceErrors };
