export const conditions = {
  nonEmptyString: (val) => val === '',
  nonEmptyArray: (val) => Array.isArray(val) && !val.length,
  validPassword: (val) => !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(val),
};

export const formValidation = (args) => {
  const failedValidation = args.fields.some((el) => el.condition);
  function onSubmit(actuallySubmit) {
    if (failedValidation) {
      args.fields.map((element) => {
        args.errorSetter((prev) => [
          ...new Set(
            element.condition ? [...prev, element.error] : [...prev.filter((existing) => existing !== element.error)]
          ),
        ]);
      });
      return;
    }
    actuallySubmit();
  }

  return {
    onSubmit: onSubmit,
  };
};
