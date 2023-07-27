const isPhoneValidation = <T extends string>(PhoneNumber: T) => {
  const matching = PhoneNumber.match(
    /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/
  );
  if (matching) {
    return true;
  } else {
    return false;
  }
};

export default isPhoneValidation;
