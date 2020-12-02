/**
 * @param queriedId ID got from the url
 * @returns The parsed int ID, or -1 if unsuccessful
 */
export function getIntId(queriedId: string | string[] | undefined) {
  let intId = typeof queriedId === 'string' ? parseInt(queriedId) : -1;
  if (isNaN(intId)) {
    return -1;
  } else {
    return intId;
  }
}
