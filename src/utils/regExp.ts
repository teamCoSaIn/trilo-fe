const nicknameRegExp = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]{1,100}$/;

const placeSearchInputRegExp = /^[^<>]{1,85}$/;

const tripTitleRegExp = /^[^<>]{1,20}$/;

const specialCharRegExp = /[^\w\s]/;

const min1max100RegExp = /^.{1,100}$/;

export {
  nicknameRegExp,
  placeSearchInputRegExp,
  tripTitleRegExp,
  specialCharRegExp,
  min1max100RegExp,
};
