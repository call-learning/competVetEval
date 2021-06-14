export function parseIntMember(object: any, value: string) {
  if (object && object[value] && typeof (object[value] === 'string'))
    object[value] = parseInt(object[value], 10)
}

export function parseFloatMember(object: any, value: string) {
  if (object && object[value] && typeof (object[value] === 'string'))
    object[value] = parseFloat(object[value])
}

export function parseBooleanMember(object: any, value: string) {
  if (object && object[value] && typeof object[value] === 'number')
    object[value] = object[value] >= 1
  else if (object && object[value] && typeof object[value] === 'string')
    object[value] = parseInt(object[value], 10) >= 1
}

export function parseDateMember(object: any, value: string) {
  if (object && object[value] && typeof (object[value] === 'string'))
    object[value] = new Date(object[value].replace(' ', 'T'))
}

export function parseDateFromTimestampMember(object: any, value: string) {
  if (object && object[value] && typeof (object[value] === 'number'))
    object[value] = new Date(object[value] * 1000)
}
