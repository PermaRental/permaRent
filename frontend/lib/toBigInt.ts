// 创建一个辅助函数来处理 BigInt 转换
const toBigInt = (
  value: number | string | undefined,
  // @ts-ignore
  defaultValue = 0n
): bigint => {
  if (value === undefined) return BigInt(defaultValue);
  return BigInt(value);
};
